import { useEffect, useState } from 'react';

const DEFAULT_STEP_THRESHOLD = 0.6;

// Rounds a continuous position to an index, only switching once it moves past the threshold.
export function useSteppedIndex(position: number, threshold: number = DEFAULT_STEP_THRESHOLD): number {
  const [index, setIndex] = useState(() => Math.round(position));

  useEffect(() => {
    if (Math.abs(position - index) >= threshold) setIndex(Math.round(position));
  }, [position, index, threshold]);

  return index;
}
