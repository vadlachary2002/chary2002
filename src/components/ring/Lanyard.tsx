import { useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { CARD_CLIP_GAP, CARD_DEPTH, CARD_HEIGHT } from '../../config/card';
import { badgePalette } from '../../config/theme';
import { BAND_TEXTURE_ASPECT } from '../../utils/badgeTextures';
import { createCardBodyGeometry, createCardFaceGeometry } from '../../utils/cardGeometry';
import type { CardHold } from '../../types/cardHold';
import { RELEASED_HOLD } from '../../types/cardHold';
import { createStrapGeometry, updateStrapGeometry } from '../../utils/strapGeometry';
import type { SwingConfig, SwingState, Vec2 } from '../../utils/swing';
import { CARD_PHASES, cardRoll, clipPosition, createSwingState, stepSwing, strapEnd, strapStretch, TEAR_HOLD_S, tearProgress } from '../../utils/swing';

export const STRAP_BASE_WIDTH = 0.22;
export const FAST_ANCHOR_SPEED = 8;
export const GENTLE_ANCHOR_SPEED = 3;
const MAX_STRAP_REACH = 9;
const TEAR_STRETCH_RATIO = 3.5;
const MIN_TEAR_LENGTH = 1.8;
const MIN_STRAP_THICKNESS = 0.35;
const TEAR_TREMBLE_START = 0.5;
const TEAR_TREMBLE_AMPLITUDE = 0.05;
const STRAP_SLACK_SAG = 0.6;
const STRAP_SWAY_SPEED = 12;
const STRAP_CURVE_POINTS = 32;
const DEPTH_FOLLOW_SPEED = 8;
const SCALE_FOLLOW_SPEED = 6;
const CLIP_OFFSET_PER_SCALE = CARD_HEIGHT / 2 + CARD_CLIP_GAP;
const DRAGGING_BODY_CLASS = 'is-dragging-card';
const CLICK_MAX_TRAVEL_PX = 6;
const TOUCH_INTENT_PX = 8;
const TOUCH_POINTER = 'touch';
const FACE_METALNESS = 0.35;
const FACE_REFLECTION_STRENGTH = 0.35;
const FACE_LIFT = 0.006;
const FULL_TURN = Math.PI * 2;

export interface LanyardProps {
  anchor: [number, number, number];
  scale: number;
  strapLength: number;
  bandWidth: number;
  frontTexture: THREE.Texture;
  backTexture: THREE.Texture;
  bandTexture: THREE.Texture;
  edgeColor?: string;
  getAnchor: (target: THREE.Vector3) => void;
  getYaw?: () => number;
  spinSignal?: number;
  isInteractive?: boolean;
  isTumbling?: boolean;
  maxAnchorSpeed?: number;
  onSelect?: () => void;
  onHoldChange?: (hold: CardHold) => void;
}

interface StrapDrawScratch {
  anchorWorld: THREE.Vector3;
  clipWorld: THREE.Vector3;
  midpoint: THREE.Vector3;
  swayingMidpoint: THREE.Vector3;
  control: THREE.Vector3;
  hasSway: { value: boolean };
}

const rayDirection = new THREE.Vector3();

// Intersects the pointer's ray with the plane z = depth, giving where on that plane the pointer is.
function pointerOnDepthPlane(pointer: THREE.Vector2, camera: THREE.Camera, depth: number, target: THREE.Vector3): THREE.Vector3 {
  rayDirection.set(pointer.x, pointer.y, 0.5).unproject(camera).sub(camera.position).normalize();
  const distance = (depth - camera.position.z) / rayDirection.z;
  return target.copy(camera.position).addScaledVector(rayDirection, distance);
}

// A silver card hanging from an elastic strap whose top follows a moving anchor.
export function Lanyard({
  anchor,
  scale,
  strapLength,
  bandWidth,
  frontTexture,
  backTexture,
  bandTexture,
  edgeColor = badgePalette.cardEdge,
  getAnchor,
  getYaw,
  spinSignal,
  isInteractive = true,
  isTumbling = false,
  maxAnchorSpeed = FAST_ANCHOR_SPEED,
  onSelect,
  onHoldChange,
}: LanyardProps) {
  const cardGroup = useRef<THREE.Group>(null);
  const scaledCard = useRef<THREE.Group>(null);
  const band = useRef<THREE.Mesh>(null);
  const displayedScale = useRef(scale);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const grabOffset = useRef<Vec2 | null>(null);
  const pressStart = useRef<Vec2 | null>(null);
  const reportHold = useHoldReporter(onHoldChange);
  const depth = useRef(anchor[2]);

  const clipOffset = CLIP_OFFSET_PER_SCALE * scale;
  const config = useMemo<SwingConfig>(
    () => ({
      restLength: strapLength,
      maxLength: MAX_STRAP_REACH,
      tearLength: Math.max(strapLength * TEAR_STRETCH_RATIO, MIN_TEAR_LENGTH),
      pendulumLength: clipOffset,
      maxAnchorSpeed,
    }),
    [strapLength, clipOffset, maxAnchorSpeed],
  );
  const [initialSwing] = useState(() => createSwingState({ x: anchor[0], y: anchor[1] }, config));
  const swing = useRef<SwingState>(initialSwing);
  const spinOffset = useSpinOffset(spinSignal);

  const scratch = useMemo(
    () => ({
      anchorTarget: new THREE.Vector3(),
      pointerWorld: new THREE.Vector3(),
      anchorWorld: new THREE.Vector3(),
      clipWorld: new THREE.Vector3(),
      clipToCenter: new THREE.Vector3(),
      orientation: new THREE.Quaternion(),
      euler: new THREE.Euler(0, 0, 0, 'YXZ'),
      midpoint: new THREE.Vector3(),
      swayingMidpoint: new THREE.Vector3(),
      control: new THREE.Vector3(),
      hasSway: { value: false },
    }),
    [],
  );
  const strapCurve = useMemo(() => new THREE.QuadraticBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()), []);
  const faceGeometry = useMemo(createCardFaceGeometry, []);
  const bodyGeometry = useMemo(createCardBodyGeometry, []);
  const strapGeometry = useMemo(() => createStrapGeometry(STRAP_CURVE_POINTS + 1), []);
  const strapWidth = STRAP_BASE_WIDTH * bandWidth;
  const strapTileLength = strapWidth * BAND_TEXTURE_ASPECT;

  useCursorFeedback(isHovered, isDragging);

  useFrame((state, delta) => {
    if (!cardGroup.current || !scaledCard.current || !band.current) return;
    displayedScale.current += (scale - displayedScale.current) * Math.min(delta * SCALE_FOLLOW_SPEED, 1);
    scaledCard.current.scale.setScalar(displayedScale.current);
    getAnchor(scratch.anchorTarget);
    depth.current += (scratch.anchorTarget.z - depth.current) * Math.min(delta * DEPTH_FOLLOW_SPEED, 1);

    const dragClip =
      isDraggingRef.current && grabOffset.current ? dragClipFromPointer(state.pointer, state.camera, depth.current, grabOffset.current, scratch.pointerWorld) : null;
    stepSwing(
      swing.current,
      config,
      {
        anchorTarget: { x: scratch.anchorTarget.x, y: scratch.anchorTarget.y },
        yawTarget: (getYaw?.() ?? 0) + spinOffset.current,
        isTumbling,
        dragClip,
      },
      delta,
    );

    const current = swing.current;
    const clip = clipPosition(current);
    if (isDraggingRef.current) reportHold(holdStatus(current));
    const tremble = trembleOffset(tearProgress(current));
    scratch.orientation.setFromEuler(scratch.euler.set(0, current.yaw, cardRoll(current)));
    scratch.clipToCenter.set(0, -CLIP_OFFSET_PER_SCALE * displayedScale.current, 0).applyQuaternion(scratch.orientation);
    cardGroup.current.position.set(
      clip.x + scratch.clipToCenter.x + tremble.x,
      clip.y + scratch.clipToCenter.y + tremble.y,
      depth.current + scratch.clipToCenter.z,
    );
    cardGroup.current.quaternion.copy(scratch.orientation);

    const end = strapEnd(current, config);
    scratch.anchorWorld.set(current.anchor.x, current.anchor.y, depth.current);
    scratch.clipWorld.set(end.x + tremble.x, end.y + tremble.y, depth.current);
    drawStrap(scratch, strapCurve, strapLength, delta);
    const stretchFactor = Math.max(strapStretch(current, config), 1);
    const thinnedWidth = strapWidth * Math.max(1 / Math.sqrt(stretchFactor), MIN_STRAP_THICKNESS);
    updateStrapGeometry(strapGeometry, strapCurve.getPoints(STRAP_CURVE_POINTS), thinnedWidth, strapTileLength * stretchFactor);
  });

  // Starts a drag, remembering where on the card the pointer grabbed it relative to the clip.
  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (!isInteractive || isTumbling || swing.current.phase === CARD_PHASES.falling) return;
    event.stopPropagation();
    const clip = clipPosition(swing.current);
    grabOffset.current = { x: event.point.x - clip.x, y: event.point.y - clip.y };
    pressStart.current = { x: event.clientX, y: event.clientY };
    if (event.pointerType === TOUCH_POINTER) {
      pendingTouch.current = { x: event.clientX, y: event.clientY };
      return;
    }
    startDrag();
  };

  // Begins holding the card: the strap follows the pointer from the next frame.
  const startDrag = () => {
    isDraggingRef.current = true;
    setIsDragging(true);
    document.body.classList.add(DRAGGING_BODY_CLASS);
    reportHold(holdStatus(swing.current));
  };

  const pendingTouch = useTouchIntent({
    onSideways: startDrag,
    onTap: () => onSelect?.(),
  });

  useReleaseAnywhere(isDragging, pressStart, (wasClick) => {
    grabOffset.current = null;
    isDraggingRef.current = false;
    setIsDragging(false);
    document.body.classList.remove(DRAGGING_BODY_CLASS);
    reportHold(RELEASED_HOLD);
    if (wasClick) onSelect?.();
  });

  return (
    <>
      <group ref={cardGroup}>
        <group
          ref={scaledCard}
          onPointerOver={() => setIsHovered(true)}
          onPointerOut={() => setIsHovered(false)}
          onPointerDown={handlePointerDown}
        >
          <mesh geometry={bodyGeometry}>
            <meshStandardMaterial color={edgeColor} metalness={1} roughness={0.22} />
          </mesh>
          <mesh geometry={faceGeometry} position={[0, 0, CARD_DEPTH / 2 + FACE_LIFT]}>
            <SilverFaceMaterial map={frontTexture} />
          </mesh>
          <mesh geometry={faceGeometry} position={[0, 0, -CARD_DEPTH / 2 - FACE_LIFT]} rotation={[0, Math.PI, 0]}>
            <SilverFaceMaterial map={backTexture} />
          </mesh>
          <BadgeClip offset={CARD_HEIGHT / 2} color={edgeColor} />
        </group>
      </group>
      <mesh ref={band} geometry={strapGeometry} frustumCulled={false}>
        <meshBasicMaterial map={bandTexture} side={THREE.DoubleSide} toneMapped={false} polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-2} />
      </mesh>
    </>
  );
}

// What the visitor's hold looks like right now: still pulling, counting down to a tear, or already torn.
function holdStatus(state: SwingState): CardHold {
  if (state.phase !== CARD_PHASES.attached) return { isHeld: true, secondsToTear: null, isTorn: true };
  const progress = tearProgress(state);
  const secondsToTear = progress > 0 ? Math.max(Math.ceil((1 - progress) * TEAR_HOLD_S), 1) : null;
  return { isHeld: true, secondsToTear, isTorn: false };
}

// Calls back only when the hold status actually changes, so the page doesn't re-render every frame.
function useHoldReporter(onHoldChange: ((hold: CardHold) => void) | undefined): (hold: CardHold) => void {
  const lastReported = useRef<string>('');
  const callback = useRef(onHoldChange);
  useEffect(() => {
    callback.current = onHoldChange;
  });
  return useMemo(
    () => (hold: CardHold) => {
      const key = `${hold.isHeld}:${hold.secondsToTear}:${hold.isTorn}`;
      if (key === lastReported.current) return;
      lastReported.current = key;
      callback.current?.(hold);
    },
    [],
  );
}

// Small random shake that grows as the strap gets close to tearing.
function trembleOffset(progress: number): Vec2 {
  if (progress <= TEAR_TREMBLE_START) return { x: 0, y: 0 };
  const amplitude = ((progress - TEAR_TREMBLE_START) / (1 - TEAR_TREMBLE_START)) * TEAR_TREMBLE_AMPLITUDE;
  return { x: (Math.random() - 0.5) * amplitude, y: (Math.random() - 0.5) * amplitude };
}

// Where the strap's clip should be while the pointer holds the card.
function dragClipFromPointer(pointer: THREE.Vector2, camera: THREE.Camera, depth: number, grabOffset: Vec2, scratch: THREE.Vector3): Vec2 {
  const pointerWorld = pointerOnDepthPlane(pointer, camera, depth, scratch);
  return { x: pointerWorld.x - grabOffset.x, y: pointerWorld.y - grabOffset.y };
}

// Adds a full turn to the card's target yaw each time the spin signal changes, so it spins once and lands.
function useSpinOffset(spinSignal: number | undefined): { current: number } {
  const spinOffset = useRef(0);
  const previousSignal = useRef(spinSignal);
  useEffect(() => {
    if (spinSignal === previousSignal.current) return;
    previousSignal.current = spinSignal;
    spinOffset.current += FULL_TURN;
  }, [spinSignal]);
  return spinOffset;
}

// Shapes the strap: straight when stretched, sagging when slack, with a lagging midpoint for sway.
function drawStrap(scratch: StrapDrawScratch, curve: THREE.QuadraticBezierCurve3, restLength: number, delta: number): void {
  const slack = Math.max(restLength - scratch.anchorWorld.distanceTo(scratch.clipWorld), 0);
  scratch.midpoint.addVectors(scratch.anchorWorld, scratch.clipWorld).multiplyScalar(0.5);
  scratch.midpoint.y -= slack * STRAP_SLACK_SAG;
  if (!scratch.hasSway.value) {
    scratch.swayingMidpoint.copy(scratch.midpoint);
    scratch.hasSway.value = true;
  }
  scratch.swayingMidpoint.lerp(scratch.midpoint, Math.min(delta * STRAP_SWAY_SPEED, 1));
  scratch.control
    .copy(scratch.swayingMidpoint)
    .multiplyScalar(2)
    .sub(scratch.midpoint.addVectors(scratch.anchorWorld, scratch.clipWorld).multiplyScalar(0.5));
  curve.v0.copy(scratch.anchorWorld);
  curve.v1.copy(scratch.control);
  curve.v2.copy(scratch.clipWorld);
}

// Brushed-metal face material: the printed texture with a glossy clear coat.
function SilverFaceMaterial({ map }: { map: THREE.Texture }) {
  return (
    <meshPhysicalMaterial
      map={map}
      metalness={FACE_METALNESS}
      roughness={0.3}
      clearcoat={1}
      clearcoatRoughness={0.1}
      envMapIntensity={FACE_REFLECTION_STRENGTH}
      polygonOffset
      polygonOffsetFactor={-1}
      polygonOffsetUnits={-4}
    />
  );
}

// Metal clip and ring that join the card to the strap.
function BadgeClip({ offset, color }: { offset: number; color: string }) {
  return (
    <group position={[0, offset, 0]}>
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[0.34, 0.14, 0.07]} />
        <meshStandardMaterial color={color} metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <torusGeometry args={[0.08, 0.02, 12, 32]} />
        <meshStandardMaterial color={color} metalness={1} roughness={0.2} />
      </mesh>
    </group>
  );
}

interface TouchIntentHandlers {
  onSideways: () => void;
  onTap: () => void;
}

// On touch screens, waits to see the finger's direction: sideways grabs the card, vertical is left to scroll the page.
function useTouchIntent(handlers: TouchIntentHandlers): { current: Vec2 | null } {
  const pendingTouch = useRef<Vec2 | null>(null);
  const handlersRef = useRef(handlers);
  useEffect(() => {
    handlersRef.current = handlers;
  });
  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      const start = pendingTouch.current;
      if (!start) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (Math.hypot(dx, dy) < TOUCH_INTENT_PX) return;
      pendingTouch.current = null;
      if (Math.abs(dx) > Math.abs(dy)) handlersRef.current.onSideways();
    };
    const handleUp = (event: PointerEvent) => {
      const start = pendingTouch.current;
      pendingTouch.current = null;
      if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) < CLICK_MAX_TRAVEL_PX) handlersRef.current.onTap();
    };
    const handleCancel = () => {
      pendingTouch.current = null;
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleCancel);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleCancel);
    };
  }, []);
  return pendingTouch;
}

// Ends a drag on the next pointer release anywhere on the page, and reports whether it was a click.
function useReleaseAnywhere(isDragging: boolean, pressStart: { current: Vec2 | null }, onRelease: (wasClick: boolean) => void): void {
  const releaseRef = useRef(onRelease);
  useEffect(() => {
    releaseRef.current = onRelease;
  });
  useEffect(() => {
    if (!isDragging) return;
    const release = (event: PointerEvent | FocusEvent) => {
      const start = pressStart.current;
      const wasClick =
        event instanceof PointerEvent &&
        event.type === 'pointerup' &&
        start !== null &&
        Math.hypot(event.clientX - start.x, event.clientY - start.y) < CLICK_MAX_TRAVEL_PX;
      pressStart.current = null;
      releaseRef.current(wasClick);
    };
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    window.addEventListener('blur', release);
    return () => {
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
      window.removeEventListener('blur', release);
    };
  }, [isDragging, pressStart]);
}

// Shows a grab/grabbing cursor while the pointer is over a card.
function useCursorFeedback(isHovered: boolean, isDragging: boolean): void {
  useEffect(() => {
    if (!isHovered) return;
    document.body.style.cursor = isDragging ? 'grabbing' : 'grab';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [isHovered, isDragging]);
}
