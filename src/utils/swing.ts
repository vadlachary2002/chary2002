export const SWING_SUBSTEP_S = 1 / 240;
export const MAX_FRAME_S = 1 / 20;
export const TEAR_HOLD_S = 3;

const GRAVITY = 40;
const SWING_DAMPING = 3.4;
const FREE_MAX_SWING_RAD = 2.6;
const DRAG_MAX_SWING_RAD = 2.9;
const ANCHOR_INERTIA = 0.5;
const ANCHOR_SMOOTH_TIME_S = 0.16;
const STRAP_STIFFNESS = 220;
const STRAP_DAMPING = 13;
const STRAP_REST_SAG = 0.04;
const STRAP_MIN_RATIO = 0.6;
const STRAP_INERTIA = 0.04;
const REHANG_START_RATIO = 0.25;
const TORN_STRAP_RATIO = 0.55;
const TORN_STRAP_DAMPING = 2.2;
const TEAR_HOLD_DECAY = 3;
const YAW_STIFFNESS = 60;
const YAW_DAMPING = 2 * Math.sqrt(YAW_STIFFNESS);
const ROLL_STIFFNESS = 70;
const ROLL_DAMPING = 2 * Math.sqrt(ROLL_STIFFNESS);
const TUMBLE_ROLL_SPEED = 3;
const TUMBLE_YAW_SPEED = 4;
const DRAG_VELOCITY_SMOOTHING = 0.35;
const MAX_RELEASE_SWING_SPEED = 9;
const MAX_RELEASE_STRETCH_SPEED = 6;
const MAX_FLING_SPEED = 14;
const ACCELERATION_SMOOTHING = 0.2;
const FALL_RESET_S = 1.4;

export const CARD_PHASES = {
  attached: 'attached',
  torn: 'torn',
  falling: 'falling',
} as const;

export type CardPhase = (typeof CARD_PHASES)[keyof typeof CARD_PHASES];

export interface Vec2 {
  x: number;
  y: number;
}

export interface SwingState {
  phase: CardPhase;
  anchor: Vec2;
  anchorVelocity: Vec2;
  anchorAcceleration: Vec2;
  swingAngle: number;
  swingSpeed: number;
  strapLength: number;
  stretchSpeed: number;
  yaw: number;
  yawSpeed: number;
  roll: number;
  rollSpeed: number;
  tumbleRoll: number;
  tearHold: number;
  looseClip: Vec2;
  looseVelocity: Vec2;
  tornAngle: number;
  tornSpeed: number;
  fallTimer: number;
}

export interface SwingConfig {
  restLength: number;
  maxLength: number;
  tearLength: number;
  pendulumLength: number;
  maxAnchorSpeed: number;
}

export interface SwingInput {
  anchorTarget: Vec2;
  yawTarget: number;
  isTumbling: boolean;
  dragClip: Vec2 | null;
}

// Starting state: hanging straight down from the anchor, strap at its natural length.
export function createSwingState(anchor: Vec2, config: SwingConfig): SwingState {
  return {
    phase: CARD_PHASES.attached,
    anchor: { ...anchor },
    anchorVelocity: { x: 0, y: 0 },
    anchorAcceleration: { x: 0, y: 0 },
    swingAngle: 0,
    swingSpeed: 0,
    strapLength: config.restLength * (1 + STRAP_REST_SAG),
    stretchSpeed: 0,
    yaw: 0,
    yawSpeed: 0,
    roll: 0,
    rollSpeed: 0,
    tumbleRoll: 0,
    tearHold: 0,
    looseClip: { ...anchor },
    looseVelocity: { x: 0, y: 0 },
    tornAngle: 0,
    tornSpeed: 0,
    fallTimer: 0,
  };
}

// Point at the given angle and distance below the anchor.
function pointFromAnchor(anchor: Vec2, angle: number, length: number): Vec2 {
  return { x: anchor.x + length * Math.sin(angle), y: anchor.y - length * Math.cos(angle) };
}

// Where the card's clip is: at the strap's end, or free in the visitor's hand or mid-fall after a tear.
export function clipPosition(state: SwingState): Vec2 {
  return state.phase === CARD_PHASES.attached ? pointFromAnchor(state.anchor, state.swingAngle, state.strapLength) : { ...state.looseClip };
}

// Where the strap ends: at the clip, or the frayed end of the piece left hanging after a tear.
export function strapEnd(state: SwingState, config: SwingConfig): Vec2 {
  if (state.phase === CARD_PHASES.attached) return clipPosition(state);
  return pointFromAnchor(state.anchor, state.tornAngle, config.restLength * TORN_STRAP_RATIO);
}

// Card roll: eases toward the strap's swing when hanging, upright while held, plus any free tumble.
export function cardRoll(state: SwingState): number {
  return state.roll + state.tumbleRoll;
}

// How far the strap is stretched relative to its natural length.
export function strapStretch(state: SwingState, config: SwingConfig): number {
  return state.phase === CARD_PHASES.attached ? state.strapLength / config.restLength : TORN_STRAP_RATIO;
}

// 0..1 progress toward tearing while the strap is held over-stretched.
export function tearProgress(state: SwingState): number {
  return state.phase === CARD_PHASES.attached ? Math.min(state.tearHold / TEAR_HOLD_S, 1) : 0;
}

// Eases the anchor toward its target with a critically damped follow, so starts and stops are smooth.
function stepAnchor(state: SwingState, target: Vec2, maxSpeed: number, step: number): void {
  const omega = 2 / ANCHOR_SMOOTH_TIME_S;
  const x = omega * step;
  const decay = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const maxChange = maxSpeed * ANCHOR_SMOOTH_TIME_S;
  const previousVelocity = { ...state.anchorVelocity };
  (['x', 'y'] as const).forEach((axis) => {
    const change = Math.min(Math.max(state.anchor[axis] - target[axis], -maxChange), maxChange);
    const clampedTarget = state.anchor[axis] - change;
    const temp = (state.anchorVelocity[axis] + omega * change) * step;
    state.anchorVelocity[axis] = (state.anchorVelocity[axis] - omega * temp) * decay;
    state.anchor[axis] = clampedTarget + (change + temp) * decay;
  });
  (['x', 'y'] as const).forEach((axis) => {
    const rawAcceleration = (state.anchorVelocity[axis] - previousVelocity[axis]) / step;
    state.anchorAcceleration[axis] += (rawAcceleration * ANCHOR_INERTIA - state.anchorAcceleration[axis]) * ACCELERATION_SMOOTHING;
  });
}

// Pendulum swing driven by gravity and the anchor's motion, damped and kept from looping over.
function stepSwingAngle(state: SwingState, config: SwingConfig, step: number): void {
  const effectiveLength = state.strapLength + config.pendulumLength;
  const { x: accelX, y: accelY } = state.anchorAcceleration;
  const angularAcceleration =
    -((GRAVITY + accelY) * Math.sin(state.swingAngle) + accelX * Math.cos(state.swingAngle)) / effectiveLength -
    SWING_DAMPING * state.swingSpeed;
  state.swingSpeed += angularAcceleration * step;
  state.swingAngle += state.swingSpeed * step;
  if (Math.abs(state.swingAngle) > FREE_MAX_SWING_RAD) {
    state.swingAngle = Math.sign(state.swingAngle) * FREE_MAX_SWING_RAD;
    state.swingSpeed = 0;
  }
}

// Elastic strap: springs toward its natural length and stretches a little when the anchor jerks.
function stepStrapLength(state: SwingState, config: SwingConfig, step: number): void {
  const restWithSag = config.restLength * (1 + STRAP_REST_SAG);
  const jerk = -(state.anchorAcceleration.y * Math.cos(state.swingAngle) - state.anchorAcceleration.x * Math.sin(state.swingAngle));
  const acceleration = -STRAP_STIFFNESS * (state.strapLength - restWithSag) - STRAP_DAMPING * state.stretchSpeed + jerk * STRAP_INERTIA;
  state.stretchSpeed += acceleration * step;
  state.strapLength += state.stretchSpeed * step;
  clampStrap(state, config);
}

// Keeps the strap between its shortest and fully stretched length.
function clampStrap(state: SwingState, config: SwingConfig): void {
  const minLength = config.restLength * STRAP_MIN_RATIO;
  if (state.strapLength < minLength || state.strapLength > config.maxLength) {
    state.strapLength = Math.min(Math.max(state.strapLength, minLength), config.maxLength);
    state.stretchSpeed = 0;
  }
}

// Critically damped spring toward a target angle, shared by yaw and roll.
function springAngle(value: number, speed: number, target: number, stiffness: number, damping: number, step: number): [number, number] {
  const nextSpeed = speed + (stiffness * (target - value) - damping * speed) * step;
  return [value + nextSpeed * step, nextSpeed];
}

// Turns the card toward its target yaw, or spins it freely while tumbling or falling.
function stepYaw(state: SwingState, input: SwingInput, step: number): void {
  if (input.isTumbling || state.phase === CARD_PHASES.falling) {
    state.yaw += TUMBLE_YAW_SPEED * step;
    state.tumbleRoll += TUMBLE_ROLL_SPEED * step;
    return;
  }
  [state.yaw, state.yawSpeed] = springAngle(state.yaw, state.yawSpeed, input.yawTarget, YAW_STIFFNESS, YAW_DAMPING, step);
}

// Keeps the card upright while held, and eases it back into following the strap once let go.
function stepRoll(state: SwingState, isHeld: boolean, step: number): void {
  const isHanging = state.phase === CARD_PHASES.attached && !isHeld;
  const target = isHanging ? state.swingAngle : 0;
  [state.roll, state.rollSpeed] = springAngle(state.roll, state.rollSpeed, target, ROLL_STIFFNESS, ROLL_DAMPING, step);
}

// Places the strap where the pointer holds the card, records momentum, and counts how long it's held over-stretched.
function applyDrag(state: SwingState, config: SwingConfig, dragClip: Vec2, step: number): void {
  const dx = dragClip.x - state.anchor.x;
  const dy = dragClip.y - state.anchor.y;
  const length = Math.min(Math.max(Math.hypot(dx, dy), config.restLength * STRAP_MIN_RATIO), config.maxLength);
  const angle = Math.min(Math.max(Math.atan2(dx, -dy), -DRAG_MAX_SWING_RAD), DRAG_MAX_SWING_RAD);
  const swingSpeed = (angle - state.swingAngle) / step;
  const stretchSpeed = (length - state.strapLength) / step;
  state.swingSpeed += (clampMagnitude(swingSpeed, MAX_RELEASE_SWING_SPEED) - state.swingSpeed) * DRAG_VELOCITY_SMOOTHING;
  state.stretchSpeed += (clampMagnitude(stretchSpeed, MAX_RELEASE_STRETCH_SPEED) - state.stretchSpeed) * DRAG_VELOCITY_SMOOTHING;
  state.swingAngle = angle;
  state.strapLength = length;
  state.tearHold = length >= config.tearLength ? state.tearHold + step : Math.max(state.tearHold - TEAR_HOLD_DECAY * step, 0);
  if (state.tearHold >= TEAR_HOLD_S) tearStrap(state, dragClip);
}

// Snaps the strap: the card stays in the visitor's hand and the torn piece starts swinging from the anchor.
function tearStrap(state: SwingState, dragClip: Vec2): void {
  state.phase = CARD_PHASES.torn;
  state.looseClip = { ...dragClip };
  state.looseVelocity = { x: 0, y: 0 };
  state.tornAngle = state.swingAngle;
  state.tornSpeed = 0;
  state.tearHold = 0;
}

// Moves the torn card with the pointer, tracking its speed so letting go flings it.
function holdTornCard(state: SwingState, dragClip: Vec2, step: number): void {
  const velocity = { x: (dragClip.x - state.looseClip.x) / step, y: (dragClip.y - state.looseClip.y) / step };
  state.looseVelocity.x += (clampMagnitude(velocity.x, MAX_FLING_SPEED) - state.looseVelocity.x) * DRAG_VELOCITY_SMOOTHING;
  state.looseVelocity.y += (clampMagnitude(velocity.y, MAX_FLING_SPEED) - state.looseVelocity.y) * DRAG_VELOCITY_SMOOTHING;
  state.looseClip = { ...dragClip };
}

// Free fall of a released torn card, then a fresh card re-hangs from the anchor.
function stepFalling(state: SwingState, config: SwingConfig, step: number): void {
  state.looseVelocity.y -= GRAVITY * step;
  state.looseClip.x += state.looseVelocity.x * step;
  state.looseClip.y += state.looseVelocity.y * step;
  state.fallTimer += step;
  if (state.fallTimer >= FALL_RESET_S) rehang(state, config);
}

// Swings the torn strap piece down from the anchor under gravity.
function stepTornStrap(state: SwingState, config: SwingConfig, step: number): void {
  const length = config.restLength * TORN_STRAP_RATIO;
  const angularAcceleration = -(GRAVITY * Math.sin(state.tornAngle)) / length - TORN_STRAP_DAMPING * state.tornSpeed;
  state.tornSpeed += angularAcceleration * step;
  state.tornAngle += state.tornSpeed * step;
}

// Hangs a fresh card: it starts close to the anchor and the elastic strap drops it into place.
function rehang(state: SwingState, config: SwingConfig): void {
  state.phase = CARD_PHASES.attached;
  state.strapLength = config.restLength * REHANG_START_RATIO;
  state.stretchSpeed = 0;
  state.swingAngle = 0;
  state.swingSpeed = 0;
  state.roll = 0;
  state.rollSpeed = 0;
  state.tumbleRoll = 0;
  state.fallTimer = 0;
}

// Limits a value to the range -limit..limit.
function clampMagnitude(value: number, limit: number): number {
  return Math.min(Math.max(value, -limit), limit);
}

// Advances one substep of whichever phase the card is in.
function stepPhase(state: SwingState, config: SwingConfig, dragClip: Vec2 | null, step: number): void {
  if (state.phase === CARD_PHASES.attached) {
    if (dragClip) {
      applyDrag(state, config, dragClip, step);
      return;
    }
    state.tearHold = 0;
    stepSwingAngle(state, config, step);
    stepStrapLength(state, config, step);
    return;
  }
  stepTornStrap(state, config, step);
  if (state.phase === CARD_PHASES.torn) {
    if (dragClip) holdTornCard(state, dragClip, step);
    else state.phase = CARD_PHASES.falling;
    return;
  }
  stepFalling(state, config, step);
}

// Advances the card by a frame, in small fixed substeps so slow frames never destabilise it.
export function stepSwing(state: SwingState, config: SwingConfig, input: SwingInput, frameSeconds: number): void {
  let remaining = Math.min(frameSeconds, MAX_FRAME_S);
  while (remaining > 1e-6) {
    const step = Math.min(SWING_SUBSTEP_S, remaining);
    remaining -= step;
    stepAnchor(state, input.anchorTarget, config.maxAnchorSpeed, step);
    stepYaw(state, input, step);
    stepPhase(state, config, input.dragClip, step);
    stepRoll(state, input.dragClip !== null, step);
  }
}
