export interface CardHold {
  isHeld: boolean;
  secondsToTear: number | null;
  isTorn: boolean;
}

export const RELEASED_HOLD: CardHold = { isHeld: false, secondsToTear: null, isTorn: false };
