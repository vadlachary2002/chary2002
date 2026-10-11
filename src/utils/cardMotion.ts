import { CAMERA_DISTANCE } from '../config/scene';
import type { RingLayout } from './ringLayout';
import { angleOnRing, normalizeAngleDelta, pointOnRing, PORTRAIT_CARD_SPACING_RATIO, stageToWorld, tickAngleFor, worldToStage } from './ringLayout';

export type WorldPoint = [number, number, number];

export const CARD_PHASES = {
  hanging: 'hanging',
  departing: 'departing',
} as const;

export type CardPhase = (typeof CARD_PHASES)[keyof typeof CARD_PHASES];

export const ARRIVALS = {
  emerge: 'emerge',
  slideIn: 'slideIn',
} as const;

export type Arrival = (typeof ARRIVALS)[keyof typeof ARRIVALS];

export const DEPARTURES = {
  fall: 'fall',
  reel: 'reel',
  slideOut: 'slideOut',
} as const;

export type Departure = (typeof DEPARTURES)[keyof typeof DEPARTURES];

export interface LifecycleMotion {
  arrival: Arrival;
  departure: Departure;
}

export interface RingCard {
  key: number;
  index: number;
  phase: CardPhase;
  phaseStartedAt: number;
  spawn: WorldPoint;
}

export interface CardMotionMemory {
  lastAnchor?: WorldPoint;
  departOrigin?: WorldPoint;
}

export interface RailPlacement {
  anchor: WorldPoint;
  yaw: number;
}

export const ARRIVE_DURATION_S = 1;
export const DEPART_DURATION_S = 0.9;
export const DEPART_LIFETIME_MS = 1600;
const FALL_GRAVITY = 40;
const FALL_DRIFT_PER_S = -0.8;
const EMERGE_START_RADIUS_RATIO = 0.9;
const REEL_TARGET_RADIUS_RATIO = 0.55;
const SLIDE_INNER_RADIUS_RATIO = 0.5;
const SLIDE_IN_START_DEG = 335;
const SLIDE_OUT_END_DEG = 205;
const RAIL_WIDTH_RATIO = 0.55;
const PORTRAIT_RAIL_WIDTH_RATIO = 0.3;
const RAIL_FRONT_DEPTH = 2.4;
const PORTRAIT_FRONT_DEPTH = 0.8;
const RAIL_YAW_RATIO = 0.35;
const RAIL_DEPTH = 2.8;
const RAIL_BACK_RISE = 0.6;
const PORTRAIT_RAIL_BACK_RISE = 0;
const RAIL_DROP = 0.22;
const CHARM_FRONT_DEPTH = 2.2;
const CHARM_BACK_DEPTH = -0.6;

const RAIL_PATH_SAMPLES = 96;

// Scales x and y so a point at depth z lines up on screen with where it would sit at z = 0.
function compensatePerspective(x: number, y: number, z: number): WorldPoint {
  const depthScale = (CAMERA_DISTANCE - z) / CAMERA_DISTANCE;
  return [x * depthScale, y * depthScale, z];
}

// Current time in seconds, shared by every card animation.
export function nowSeconds(): number {
  return performance.now() / 1000;
}

// Smooth start and stop.
function easeInOutCubic(progress: number): number {
  return progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
}

// Slow start, fast finish, for things being pulled away.
function easeInCubic(progress: number): number {
  return progress ** 3;
}

// Clamps elapsed time into a 0..1 progress value.
function progressOf(elapsed: number, duration: number): number {
  return Math.min(Math.max(elapsed / duration, 0), 1);
}

// Linear blend between two world points.
function lerpPoint(from: WorldPoint, to: WorldPoint, amount: number): WorldPoint {
  return [from[0] + (to[0] - from[0]) * amount, from[1] + (to[1] - from[1]) * amount, from[2] + (to[2] - from[2]) * amount];
}

// World point at a polar angle and radius (pixels) around the ring centre.
function polarWorldPoint(layout: RingLayout, angleDeg: number, radiusPx: number): WorldPoint {
  return stageToWorld(layout, pointOnRing(layout, angleDeg, radiusPx));
}

// Blends two polar positions so motion follows the ring's curve instead of a straight line.
function polarBlend(layout: RingLayout, fromDeg: number, fromRadius: number, toDeg: number, toRadius: number, amount: number): WorldPoint {
  const angle = fromDeg + normalizeAngleDelta(toDeg - fromDeg) * amount;
  return polarWorldPoint(layout, angle, fromRadius + (toRadius - fromRadius) * amount);
}

// World position where an experience hangs: its tick on the rim, or on phones a slot in a row across the top.
export function tickAnchorPoint(layout: RingLayout, index: number, position: number): WorldPoint {
  if (layout.isPortrait) {
    const spacing = layout.stageWidth * PORTRAIT_CARD_SPACING_RATIO;
    return stageToWorld(layout, { x: layout.anchorX + (index - position) * spacing, y: layout.anchorY });
  }
  return stageToWorld(layout, pointOnRing(layout, tickAngleFor(index, position)));
}

// Off-screen point a card enters from, or leaves to, on phones.
function portraitOffscreenPoint(layout: RingLayout, direction: 'above' | 'left' | 'right'): WorldPoint {
  const cardHeightPx = layout.cardBottomPx - layout.cardTopPx;
  if (direction === 'above') return stageToWorld(layout, { x: layout.anchorX, y: layout.anchorY - cardHeightPx * 1.6 });
  const sideOffset = direction === 'left' ? -layout.stageWidth : layout.stageWidth;
  return stageToWorld(layout, { x: layout.anchorX + sideOffset, y: layout.anchorY });
}

// The fixed slot at the bottom of the ring where single-card styles hang.
export function slotAnchorPoint(layout: RingLayout): WorldPoint {
  return stageToWorld(layout, { x: layout.anchorX, y: layout.anchorY });
}

// Where a newly arriving card starts, hidden inside the disc.
export function arrivalStartPoint(layout: RingLayout, arrival: Arrival): WorldPoint {
  if (layout.isPortrait) return portraitOffscreenPoint(layout, arrival === ARRIVALS.slideIn ? 'right' : 'above');
  if (arrival === ARRIVALS.slideIn) return polarWorldPoint(layout, SLIDE_IN_START_DEG, layout.radius * SLIDE_INNER_RADIUS_RATIO);
  return stageToWorld(layout, { x: layout.centerX, y: layout.centerY - layout.radius * EMERGE_START_RADIUS_RATIO });
}

// Anchor for a card that is arriving or hanging on its tick.
function arrivingAnchor(card: RingCard, layout: RingLayout, position: number, arrival: Arrival, now: number): WorldPoint {
  const amount = easeInOutCubic(progressOf(now - card.phaseStartedAt, ARRIVE_DURATION_S));
  if (arrival === ARRIVALS.slideIn && !layout.isPortrait) {
    return polarBlend(layout, SLIDE_IN_START_DEG, layout.radius * SLIDE_INNER_RADIUS_RATIO, tickAngleFor(card.index, position), layout.radius, amount);
  }
  return lerpPoint(card.spawn, tickAnchorPoint(layout, card.index, position), amount);
}

// Anchor for a card leaving: falling free, reeled up into the disc, or slid along the rim behind it.
function departingAnchor(origin: WorldPoint, layout: RingLayout, departure: Departure, elapsed: number): WorldPoint {
  if (departure === DEPARTURES.fall) {
    return [origin[0] + FALL_DRIFT_PER_S * elapsed, origin[1] - 0.5 * FALL_GRAVITY * elapsed ** 2, origin[2]];
  }
  const amount = easeInCubic(progressOf(elapsed, DEPART_DURATION_S));
  if (layout.isPortrait) return lerpPoint(origin, portraitOffscreenPoint(layout, departure === DEPARTURES.reel ? 'above' : 'left'), amount);
  if (departure === DEPARTURES.reel) {
    const insideDisc = stageToWorld(layout, { x: layout.centerX, y: layout.centerY - layout.radius * REEL_TARGET_RADIUS_RATIO });
    return lerpPoint(origin, insideDisc, amount);
  }
  const originAngle = angleOnRing(layout, worldToStage(layout, origin));
  return polarBlend(layout, originAngle, layout.radius, SLIDE_OUT_END_DEG, layout.radius * SLIDE_INNER_RADIUS_RATIO, amount);
}

// Where a lifecycle card's strap should be attached right now.
export function resolveLifecycleAnchor(
  card: RingCard,
  layout: RingLayout,
  position: number,
  memory: CardMotionMemory,
  now: number,
  motion: LifecycleMotion,
): WorldPoint {
  if (card.phase === CARD_PHASES.departing) {
    memory.departOrigin ??= memory.lastAnchor ?? tickAnchorPoint(layout, card.index, position);
    return departingAnchor(memory.departOrigin, layout, motion.departure, now - card.phaseStartedAt);
  }
  const anchor = arrivingAnchor(card, layout, position, motion.arrival, now);
  memory.lastAnchor = anchor;
  return anchor;
}

// Anchor for a charm: always on its own tick, with the active one pulled forward.
export function charmAnchorPoint(layout: RingLayout, index: number, position: number, isActive: boolean): WorldPoint {
  const [x, y] = tickAnchorPoint(layout, index, position);
  const frontDepth = layout.isPortrait ? PORTRAIT_FRONT_DEPTH : CHARM_FRONT_DEPTH;
  return compensatePerspective(x, y, isActive ? frontDepth : CHARM_BACK_DEPTH);
}

// Point on the keychain rail at a loop angle: 0 is the front slot, PI is the far back behind the disc.
function railPoint(layout: RingLayout, angle: number): WorldPoint {
  const [slotX, slotY] = slotAnchorPoint(layout);
  const railWidthPx = layout.isPortrait ? layout.stageWidth * PORTRAIT_RAIL_WIDTH_RATIO : layout.radius * RAIL_WIDTH_RATIO;
  const railWidth = railWidthPx / layout.pixelsPerWorldUnit;
  const depthAmount = (1 - Math.cos(angle)) / 2;
  return compensatePerspective(
    slotX + railWidth * Math.sin(angle),
    slotY - (layout.isPortrait ? 0 : RAIL_DROP) + (layout.isPortrait ? PORTRAIT_RAIL_BACK_RISE : RAIL_BACK_RISE) * depthAmount,
    (layout.isPortrait ? PORTRAIT_FRONT_DEPTH : RAIL_FRONT_DEPTH) - RAIL_DEPTH * 2 * depthAmount,
  );
}

// Position and facing on the keychain rail: a U-shaped loop running from the front slot back behind the disc.
export function railPlacement(layout: RingLayout, index: number, position: number, count: number): RailPlacement {
  const angle = ((index - position) * Math.PI * 2) / Math.max(count, 1);
  return { anchor: railPoint(layout, angle), yaw: wrapRadians(angle) * RAIL_YAW_RATIO };
}

// Wraps an angle in radians into the range -PI..PI.
function wrapRadians(radians: number): number {
  return Math.atan2(Math.sin(radians), Math.cos(radians));
}

// Closed list of points tracing the rail, already corrected for perspective, for drawing the metal loop.
export function railPath(layout: RingLayout): WorldPoint[] {
  return Array.from({ length: RAIL_PATH_SAMPLES }, (_, sample) => railPoint(layout, (sample / RAIL_PATH_SAMPLES) * Math.PI * 2));
}
