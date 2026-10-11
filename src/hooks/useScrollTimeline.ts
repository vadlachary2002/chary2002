import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

const SMOOTHING_PER_SECOND = 10;
const SETTLE_EPSILON = 0.0005;

export interface ScrollTimeline {
  position: number;
  positionRef: RefObject<number>;
  scrollToPosition: (targetPosition: number, behavior?: ScrollBehavior) => void;
}

// Measures how far the page has scrolled through a tall wrapper.
function measureScrollRange(wrapper: HTMLElement): { top: number; range: number } {
  const top = wrapper.getBoundingClientRect().top + window.scrollY;
  return { top, range: Math.max(wrapper.offsetHeight - window.innerHeight, 1) };
}

// Maps scrolling through a pinned wrapper to a smoothed 0..(stepCount - 1) position, so wheel steps turn the ring gently.
export function useScrollTimeline(wrapperRef: RefObject<HTMLElement | null>, stepCount: number): ScrollTimeline {
  const [position, setPosition] = useState(0);
  const positionRef = useRef(0);
  const targetRef = useRef(0);
  const lastIndex = Math.max(stepCount - 1, 0);

  useEffect(() => {
    let animationFrame = 0;
    let lastTime = 0;

    const readTarget = (): number => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return targetRef.current;
      const { top, range } = measureScrollRange(wrapper);
      return Math.min(Math.max((window.scrollY - top) / range, 0), 1) * lastIndex;
    };

    const animate = (time: number) => {
      const elapsed = lastTime ? (time - lastTime) / 1000 : 0;
      lastTime = time;
      const remaining = targetRef.current - positionRef.current;
      const isSettled = Math.abs(remaining) < SETTLE_EPSILON;
      positionRef.current = isSettled ? targetRef.current : positionRef.current + remaining * (1 - Math.exp(-SMOOTHING_PER_SECOND * elapsed));
      setPosition(positionRef.current);
      animationFrame = isSettled ? 0 : requestAnimationFrame(animate);
    };

    const handleScroll = () => {
      targetRef.current = readTarget();
      if (animationFrame) return;
      lastTime = 0;
      animationFrame = requestAnimationFrame(animate);
    };

    targetRef.current = readTarget();
    positionRef.current = targetRef.current;
    setPosition(positionRef.current);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [wrapperRef, lastIndex]);

  const scrollToPosition = useCallback(
    (targetPosition: number, behavior: ScrollBehavior = 'smooth') => {
      const wrapper = wrapperRef.current;
      if (!wrapper || lastIndex === 0) return;
      const { top, range } = measureScrollRange(wrapper);
      const clampedPosition = Math.min(Math.max(targetPosition, 0), lastIndex);
      window.scrollTo({ top: top + (clampedPosition / lastIndex) * range, behavior });
    },
    [wrapperRef, lastIndex],
  );

  return { position, positionRef, scrollToPosition };
}
