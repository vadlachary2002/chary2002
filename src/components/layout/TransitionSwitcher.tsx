import { useId } from 'react';
import type { TransitionStyle } from '../../config/transitions';
import { isTransitionStyle, TRANSITION_OPTIONS } from '../../config/transitions';

interface TransitionSwitcherProps {
  style: TransitionStyle;
  onChange: (style: TransitionStyle) => void;
}

// Compact dropdown in the nav for trying each ring transition style.
export function TransitionSwitcher({ style, onChange }: TransitionSwitcherProps) {
  const selectId = useId();

  return (
    <div className="switcher">
      <label htmlFor={selectId} className="switcher__label">
        Style
      </label>
      <select
        id={selectId}
        className="switcher__select"
        value={style}
        onChange={(event) => {
          if (isTransitionStyle(event.target.value)) onChange(event.target.value);
        }}
      >
        {TRANSITION_OPTIONS.map((option) => (
          <option key={option.style} value={option.style}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
