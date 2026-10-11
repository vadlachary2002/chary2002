import { useCallback, useState } from 'react';
import type { TransitionStyle } from '../config/transitions';
import { DEFAULT_TRANSITION_STYLE, isTransitionStyle } from '../config/transitions';

const STORAGE_KEY = 'portfolio-ring-transition';

// Reads the visitor's last chosen style, falling back to the default when storage is unavailable.
function readStoredStyle(): TransitionStyle {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isTransitionStyle(stored) ? stored : DEFAULT_TRANSITION_STYLE;
  } catch {
    return DEFAULT_TRANSITION_STYLE;
  }
}

// Current ring transition style plus a setter that remembers the choice in this browser.
export function useTransitionStyle(): [TransitionStyle, (style: TransitionStyle) => void] {
  const [style, setStyle] = useState<TransitionStyle>(readStoredStyle);

  const changeStyle = useCallback((nextStyle: TransitionStyle) => {
    setStyle(nextStyle);
    try {
      window.localStorage.setItem(STORAGE_KEY, nextStyle);
    } catch {
      return;
    }
  }, []);

  return [style, changeStyle];
}
