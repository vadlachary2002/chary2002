import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

export interface ElementSize {
  width: number;
  height: number;
}

// Tracks an element's padding-box size with a ResizeObserver.
export function useElementSize(elementRef: RefObject<HTMLElement | null>): ElementSize {
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      const width = element.clientWidth;
      const height = element.clientHeight;
      setSize((previous) => (previous.width === width && previous.height === height ? previous : { width, height }));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef]);

  return size;
}
