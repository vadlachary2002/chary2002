import type { CSSProperties } from 'react';
import type { Experience } from '../../types/profile';
import { periodWithDuration } from '../../utils/experience';
import type { RingLayout } from '../../utils/ringLayout';

interface RingCardFallbackProps {
  layout: RingLayout;
  experience: Experience;
}

// Static card hanging from the ring when WebGL or motion is unavailable.
export function RingCardFallback({ layout, experience }: RingCardFallbackProps) {
  const style = {
    left: layout.anchorX - layout.cardHalfWidthPx,
    top: layout.anchorY,
    width: layout.cardHalfWidthPx * 2,
    '--strap-height': `${layout.cardTopPx - layout.anchorY}px`,
  } as CSSProperties;

  return (
    <div className="ring-fallback" style={style} aria-hidden="true">
      <div className="ring-fallback__strap" />
      <div className="ring-fallback__card">
        <span className="ring-fallback__company">{experience.company}</span>
        <strong>{experience.title}</strong>
        <span className="ring-fallback__period">{periodWithDuration(experience)}</span>
      </div>
    </div>
  );
}
