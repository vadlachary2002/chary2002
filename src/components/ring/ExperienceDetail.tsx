import type { CSSProperties } from 'react';
import type { Experience } from '../../types/profile';
import type { RingLayout } from '../../utils/ringLayout';
import { monogramOf, periodWithDuration } from '../../utils/experience';
import { scrollToExperience } from '../../utils/scroll';

const PANEL_GAP_PX = 110;
const PANEL_MAX_WIDTH_PX = 340;

interface ExperienceDetailProps {
  layout: RingLayout;
  experience: Experience;
  index: number;
  total: number;
  onStep: (direction: -1 | 1) => void;
  isSoundOn: boolean;
  onToggleSound: () => void;
}

// Places the panel beside the card on wide screens; on phones CSS pins it to the bottom at its natural height.
function panelPosition(layout: RingLayout): CSSProperties | undefined {
  if (layout.isPortrait) return undefined;
  const rightEdge = layout.anchorX - layout.cardHalfWidthPx - PANEL_GAP_PX;
  return {
    left: Math.max(rightEdge - PANEL_MAX_WIDTH_PX, 0),
    bottom: layout.stageHeight - layout.cardBottomPx,
    width: Math.min(PANEL_MAX_WIDTH_PX, rightEdge),
  };
}

// Text details for the experience currently hanging from the ring.
export function ExperienceDetail({ layout, experience, index, total, onStep, isSoundOn, onToggleSound }: ExperienceDetailProps) {
  const isCurrent = index === 0;
  const counter = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;

  return (
    <aside className="ring-detail" style={panelPosition(layout)} aria-live="polite">
      <p className="ring-detail__eyebrow">{isCurrent ? 'Recent · currently working here' : 'Previously'}</p>
      <h2 className="ring-detail__title">{experience.title}</h2>
      <div className="ring-detail__company">
        {experience.logoUrl ? (
          <img className="ring-detail__logo" src={experience.logoUrl} alt="" />
        ) : (
          <span className="ring-detail__monogram" aria-hidden="true">
            {monogramOf(experience.company)}
          </span>
        )}
        <p>
          {experience.company}
          {experience.location && <span> · {experience.location}</span>}
        </p>
      </div>
      <p className="ring-detail__period">{periodWithDuration(experience)}</p>
      <p className="ring-detail__blurb">{experience.companyBlurb ?? experience.highlights[0]}</p>
      <div className="ring-detail__controls">
        <button type="button" className="ring-detail__step" onClick={() => onStep(-1)} disabled={index === 0} aria-label="Newer experience">
          ‹
        </button>
        <span className="ring-detail__counter">{counter}</span>
        <button type="button" className="ring-detail__step" onClick={() => onStep(1)} disabled={index === total - 1} aria-label="Older experience">
          ›
        </button>
        <button
          type="button"
          className={`ring-detail__sound ${isSoundOn ? 'is-on' : ''}`}
          onClick={onToggleSound}
          aria-pressed={isSoundOn}
          aria-label={isSoundOn ? 'Turn gear sound off' : 'Turn gear sound on'}
          title={isSoundOn ? 'Gear sound on' : 'Gear sound off'}
        >
          <SpeakerIcon isOn={isSoundOn} />
        </button>
        <button type="button" className="ring-detail__more" onClick={() => scrollToExperience(experience.id)}>
          Full story
        </button>
      </div>
    </aside>
  );
}

// Small speaker glyph with sound waves when on and a cross when muted.
function SpeakerIcon({ isOn }: { isOn: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
      {isOn ? (
        <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
      ) : (
        <path d="M17 9l5 6M22 9l-5 6" />
      )}
    </svg>
  );
}
