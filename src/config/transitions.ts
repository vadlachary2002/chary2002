export const TRANSITION_STYLES = {
  keychain: 'keychain',
  charms: 'charms',
  reel: 'reel',
  flip: 'flip',
  slide: 'slide',
  drop: 'drop',
} as const;

export type TransitionStyle = (typeof TRANSITION_STYLES)[keyof typeof TRANSITION_STYLES];

export interface TransitionOption {
  style: TransitionStyle;
  label: string;
}

export const DEFAULT_TRANSITION_STYLE: TransitionStyle = TRANSITION_STYLES.keychain;
export const SHOW_TRANSITION_SWITCHER = true;

export const TRANSITION_OPTIONS: TransitionOption[] = [
  { style: TRANSITION_STYLES.keychain, label: 'Keychain' },
  { style: TRANSITION_STYLES.charms, label: 'Charms' },
  { style: TRANSITION_STYLES.reel, label: 'Reel in / out' },
  { style: TRANSITION_STYLES.flip, label: 'Coin flip' },
  { style: TRANSITION_STYLES.slide, label: 'Slide' },
  { style: TRANSITION_STYLES.drop, label: 'Drop' },
];

// Narrows an arbitrary stored string to a known transition style.
export function isTransitionStyle(value: string | null): value is TransitionStyle {
  return TRANSITION_OPTIONS.some((option) => option.style === value);
}
