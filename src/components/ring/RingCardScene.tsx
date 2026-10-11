import { Environment, Lightformer } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { memo } from 'react';
import type { RefObject } from 'react';
import { CAMERA_DISTANCE, CAMERA_FOV } from '../../config/scene';
import type { TransitionStyle } from '../../config/transitions';
import { TRANSITION_STYLES } from '../../config/transitions';
import { useExperienceTextures } from '../../hooks/useExperienceTextures';
import { useFontsReady } from '../../hooks/useFontsReady';
import type { CardHold } from '../../types/cardHold';
import type { Experience } from '../../types/profile';
import { TEXTURE_FONT_DESCRIPTORS } from '../../utils/badgeTextures';
import type { LifecycleMotion } from '../../utils/cardMotion';
import { ARRIVALS, DEPARTURES } from '../../utils/cardMotion';
import type { RingLayout } from '../../utils/ringLayout';
import { stageToWorld } from '../../utils/ringLayout';
import { CharmCards } from './styles/CharmCards';
import { FlipCard } from './styles/FlipCard';
import { KeychainCards } from './styles/KeychainCards';
import { LifecycleCards } from './styles/LifecycleCards';
import type { RingStyleProps } from './styles/styleProps';

const OCCLUDER_DEPTH = 0.6;
const OCCLUDER_SEGMENTS = 96;
const OCCLUDER_RIM_INSET_PX = 2;
const ENVIRONMENT_TINT = '#9da3b0';
const AMBIENT_LIGHT_INTENSITY = 1.3;

const LIFECYCLE_MOTIONS: Partial<Record<TransitionStyle, LifecycleMotion>> = {
  [TRANSITION_STYLES.reel]: { arrival: ARRIVALS.emerge, departure: DEPARTURES.reel },
  [TRANSITION_STYLES.slide]: { arrival: ARRIVALS.slideIn, departure: DEPARTURES.slideOut },
  [TRANSITION_STYLES.drop]: { arrival: ARRIVALS.emerge, departure: DEPARTURES.fall },
};

interface RingCardSceneProps {
  eventSource: RefObject<HTMLElement>;
  layout: RingLayout;
  experiences: Experience[];
  activeIndex: number;
  positionRef: RefObject<number>;
  transitionStyle: TransitionStyle;
  onHoldChange: (hold: CardHold) => void;
  onSelectCard: () => void;
}

// Canvas that renders the experience cards in the chosen transition style.
function RingCardScene({ eventSource, transitionStyle, ...cardProps }: RingCardSceneProps) {
  const areFontsReady = useFontsReady(TEXTURE_FONT_DESCRIPTORS);
  const textures = useExperienceTextures(cardProps.experiences);
  const styleKey = `${transitionStyle}-${cardProps.layout.isPortrait ? 'portrait' : 'landscape'}`;

  return (
    <Canvas
      className="ring-hero__canvas"
      camera={{ position: [0, 0, CAMERA_DISTANCE], fov: CAMERA_FOV }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      flat
      eventSource={eventSource}
      eventPrefix="client"
      aria-hidden="true"
    >
      <ambientLight intensity={AMBIENT_LIGHT_INTENSITY} />
      <DiscOccluder layout={cardProps.layout} />
      {areFontsReady && <StyledCards key={styleKey} transitionStyle={transitionStyle} {...cardProps} textures={textures} />}
      <Environment resolution={256}>
        <color attach="background" args={[ENVIRONMENT_TINT]} />
        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
      </Environment>
    </Canvas>
  );
}

// Picks the card component for the active transition style.
function StyledCards({ transitionStyle, ...styleProps }: RingStyleProps & { transitionStyle: TransitionStyle }) {
  const lifecycleMotion = LIFECYCLE_MOTIONS[transitionStyle];
  if (lifecycleMotion) return <LifecycleCards {...styleProps} motion={lifecycleMotion} />;
  if (transitionStyle === TRANSITION_STYLES.flip) return <FlipCard {...styleProps} />;
  if (transitionStyle === TRANSITION_STYLES.charms) return <CharmCards {...styleProps} />;
  return <KeychainCards {...styleProps} />;
}

// Invisible depth-only disc that hides anything behind the ring's face.
function DiscOccluder({ layout }: { layout: RingLayout }) {
  const [centerX, centerY] = stageToWorld(layout, { x: layout.centerX, y: layout.centerY });
  const perspective = (CAMERA_DISTANCE - OCCLUDER_DEPTH) / CAMERA_DISTANCE;
  const radius = ((layout.radius - OCCLUDER_RIM_INSET_PX) / layout.pixelsPerWorldUnit) * perspective;

  return (
    <mesh position={[centerX * perspective, centerY * perspective, OCCLUDER_DEPTH]} renderOrder={-1}>
      <circleGeometry args={[radius, OCCLUDER_SEGMENTS]} />
      <meshBasicMaterial colorWrite={false} />
    </mesh>
  );
}

export default memo(RingCardScene);
