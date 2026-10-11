import { WORLD_HEIGHT_AT_ORIGIN } from '../config/scene';
import { CARD_CLIP_GAP, CARD_HEIGHT, CARD_WIDTH } from '../config/card';

export const ATTACH_ANGLE_DEG = 270;
export const TICK_SPACING_DEG = 36;
export const MINOR_TICK_STEP_DEG = 6;
export const PROGRESS_ARC_START_DEG = 150;
export const PROGRESS_ARC_SWEEP_DEG = 180;
const PORTRAIT_ASPECT_LIMIT = 1;
const PORTRAIT_SLOT_X_RATIO = 0.58;
const PORTRAIT_SLOT_Y_PX = 126;
export const PORTRAIT_CARD_SPACING_RATIO = 0.7;

interface RingSizing {
  radius: number;
  cornerInset: number;
  topInset: number;
  cardScale: number;
  strapLength: number;
  strapWidth: number;
}

export interface RingLayout {
  stageWidth: number;
  stageHeight: number;
  isPortrait: boolean;
  centerX: number;
  centerY: number;
  radius: number;
  anchorX: number;
  anchorY: number;
  cardScale: number;
  strapLength: number;
  strapWidth: number;
  pixelsPerWorldUnit: number;
  cardHalfWidthPx: number;
  cardTopPx: number;
  cardBottomPx: number;
}

export interface ScreenPoint {
  x: number;
  y: number;
}

// Picks ring and card sizes for a landscape or portrait stage.
function sizeRing(width: number, height: number, isPortrait: boolean): RingSizing {
  if (isPortrait) {
    const radius = width * 0.3;
    return { radius, cornerInset: radius * 0.5, topInset: radius * 0.25 + 70, cardScale: 0.9, strapLength: 0.5, strapWidth: 0.75 };
  }
  const radius = Math.min(height * 0.24, width * 0.19);
  return { radius, cornerInset: radius * 0.88, topInset: radius * 0.85, cardScale: 0.72, strapLength: 0.81, strapWidth: 0.7 };
}

// Computes ring position, card attachment point and card bounds in stage pixels.
export function computeRingLayout(stageWidth: number, stageHeight: number): RingLayout {
  const isPortrait = stageWidth / Math.max(stageHeight, 1) < PORTRAIT_ASPECT_LIMIT;
  const sizing = sizeRing(stageWidth, stageHeight, isPortrait);
  const centerX = stageWidth - sizing.cornerInset;
  const centerY = sizing.topInset;
  const pixelsPerWorldUnit = stageHeight / WORLD_HEIGHT_AT_ORIGIN;
  const anchorX = isPortrait ? stageWidth * PORTRAIT_SLOT_X_RATIO : centerX;
  const anchorY = isPortrait ? PORTRAIT_SLOT_Y_PX : centerY + sizing.radius;
  const cardTopPx = anchorY + (sizing.strapLength + CARD_CLIP_GAP * sizing.cardScale) * pixelsPerWorldUnit;

  return {
    stageWidth,
    stageHeight,
    isPortrait,
    centerX,
    centerY,
    radius: sizing.radius,
    anchorX,
    anchorY,
    cardScale: sizing.cardScale,
    strapLength: sizing.strapLength,
    strapWidth: sizing.strapWidth,
    pixelsPerWorldUnit,
    cardHalfWidthPx: (CARD_WIDTH / 2) * sizing.cardScale * pixelsPerWorldUnit,
    cardTopPx,
    cardBottomPx: cardTopPx + CARD_HEIGHT * sizing.cardScale * pixelsPerWorldUnit,
  };
}

// Converts a polar angle (degrees, counter-clockwise from +x) on a circle to stage pixels.
export function pointOnRing(layout: RingLayout, angleDeg: number, radius: number = layout.radius): ScreenPoint {
  const radians = (angleDeg * Math.PI) / 180;
  return { x: layout.centerX + radius * Math.cos(radians), y: layout.centerY - radius * Math.sin(radians) };
}

// Angle of an experience tick given the ring's continuous position.
export function tickAngleFor(index: number, position: number): number {
  return ATTACH_ANGLE_DEG + (index - position) * TICK_SPACING_DEG;
}

// Converts a stage pixel to world coordinates on the z = 0 plane.
export function stageToWorld(layout: RingLayout, point: ScreenPoint): [number, number, number] {
  const worldWidth = layout.stageWidth / layout.pixelsPerWorldUnit;
  return [
    (point.x / layout.stageWidth - 0.5) * worldWidth,
    (0.5 - point.y / layout.stageHeight) * WORLD_HEIGHT_AT_ORIGIN,
    0,
  ];
}

// Converts a world point on the z = 0 plane back to stage pixels.
export function worldToStage(layout: RingLayout, world: [number, number, number]): ScreenPoint {
  const worldWidth = layout.stageWidth / layout.pixelsPerWorldUnit;
  return {
    x: (world[0] / worldWidth + 0.5) * layout.stageWidth,
    y: (0.5 - world[1] / WORLD_HEIGHT_AT_ORIGIN) * layout.stageHeight,
  };
}

// Polar angle (degrees) of a stage point around the ring centre.
export function angleOnRing(layout: RingLayout, point: ScreenPoint): number {
  return (Math.atan2(layout.centerY - point.y, point.x - layout.centerX) * 180) / Math.PI;
}

// Builds an SVG arc path along the ring between two polar angles.
export function describeArc(layout: RingLayout, startDeg: number, sweepDeg: number, radius: number = layout.radius): string {
  const start = pointOnRing(layout, startDeg, radius);
  const end = pointOnRing(layout, startDeg + sweepDeg, radius);
  const isLargeArc = Math.abs(sweepDeg) > 180 ? 1 : 0;
  const sweepFlag = sweepDeg > 0 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${isLargeArc} ${sweepFlag} ${end.x} ${end.y}`;
}

// Normalises an angle difference into the range -180..180 degrees.
export function normalizeAngleDelta(deltaDeg: number): number {
  return ((((deltaDeg + 180) % 360) + 360) % 360) - 180;
}
