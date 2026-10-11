import { useId, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';
import type { Experience } from '../../types/profile';
import { startYearOf } from '../../utils/experience';
import type { RingLayout } from '../../utils/ringLayout';
import {
  describeArc,
  MINOR_TICK_STEP_DEG,
  normalizeAngleDelta,
  pointOnRing,
  tickAngleFor,
  TICK_SPACING_DEG,
  PROGRESS_ARC_START_DEG,
  PROGRESS_ARC_SWEEP_DEG,
} from '../../utils/ringLayout';

const HIT_STROKE_PX = 56;
const MINOR_TICK_LENGTH_PX = 7;
const MAJOR_TICK_LENGTH_PX = 16;
const LABEL_INSET_PX = 46;
const CORNER_MASK_ANGLES_DEG = [-14, 15, 45, 75, 104];
const CORNER_MASK_RADIUS_RATIO = 1.7;
const CORNER_FADE_RATIO = 0.12;
const DRAG_START_THRESHOLD_DEG = 1;
const NOW_MARKER_INDEX = -0.5;
const NOW_LABEL = 'NOW';
const NOW_LABEL_OUTSET_PX = 30;

interface ExperienceRingProps {
  layout: RingLayout;
  experiences: Experience[];
  position: number;
  activeIndex: number;
  isCardGrabbedRef: RefObject<boolean>;
  onRotate: (position: number, behavior: ScrollBehavior) => void;
  onSettle: () => void;
  onSelect: (index: number) => void;
}

interface DragState {
  pointerId: number;
  lastAngle: number;
  accumulatedDeg: number;
  startPosition: number;
}

// Returns the polar angle (degrees) of a pointer relative to the ring centre.
function pointerAngle(layout: RingLayout, event: ReactPointerEvent<SVGElement>): number {
  const bounds = event.currentTarget.ownerSVGElement?.getBoundingClientRect() ?? event.currentTarget.getBoundingClientRect();
  const x = event.clientX - bounds.left - layout.centerX;
  const y = layout.centerY - (event.clientY - bounds.top);
  return (Math.atan2(y, x) * 180) / Math.PI;
}

// Timer-style dial: experience ticks rotate around the ring as the visitor scrolls or drags.
export function ExperienceRing({ layout, experiences, position, activeIndex, isCardGrabbedRef, onRotate, onSettle, onSelect }: ExperienceRingProps) {
  const maskId = useId();
  const fadeId = useId();
  const gradientId = useId();
  const discGradientId = useId();
  const dragState = useRef<DragState | null>(null);
  const lastIndex = Math.max(experiences.length - 1, 1);
  const progressSweep = (position / lastIndex) * PROGRESS_ARC_SWEEP_DEG;
  const ringRotation = -position * TICK_SPACING_DEG;
  const progressEnd = pointOnRing(layout, PROGRESS_ARC_START_DEG + progressSweep);
  const attachPoint = { x: layout.anchorX, y: layout.anchorY };
  const nowAngle = tickAngleFor(NOW_MARKER_INDEX, position);
  const nowOuter = pointOnRing(layout, nowAngle, layout.radius + 4);
  const nowInner = pointOnRing(layout, nowAngle, layout.radius - MAJOR_TICK_LENGTH_PX);
  const nowLabel = pointOnRing(layout, nowAngle, layout.radius + NOW_LABEL_OUTSET_PX);
  const currentYear = new Date().getFullYear();
  const cornerWedge = CORNER_MASK_ANGLES_DEG.map((angle) => pointOnRing(layout, angle, layout.radius * CORNER_MASK_RADIUS_RATIO));

  // Begins a rotate gesture unless the visitor is holding the card.
  const handlePointerDown = (event: ReactPointerEvent<SVGCircleElement>) => {
    if (isCardGrabbedRef.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragState.current = { pointerId: event.pointerId, lastAngle: pointerAngle(layout, event), accumulatedDeg: 0, startPosition: position };
  };

  // Turns pointer movement around the centre into a new ring position.
  const handlePointerMove = (event: ReactPointerEvent<SVGCircleElement>) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (isCardGrabbedRef.current) {
      dragState.current = null;
      return;
    }
    const angle = pointerAngle(layout, event);
    drag.accumulatedDeg += normalizeAngleDelta(angle - drag.lastAngle);
    drag.lastAngle = angle;
    if (Math.abs(drag.accumulatedDeg) < DRAG_START_THRESHOLD_DEG) return;
    onRotate(drag.startPosition - drag.accumulatedDeg / TICK_SPACING_DEG, 'auto');
  };

  // Ends the gesture and lets the ring snap to the nearest experience.
  const handlePointerUp = (event: ReactPointerEvent<SVGCircleElement>) => {
    if (!dragState.current) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    dragState.current = null;
    onSettle();
  };

  return (
    <svg className="ring" width={layout.stageWidth} height={layout.stageHeight} aria-hidden="true">
      <defs>
        <filter id={fadeId}>
          <feGaussianBlur stdDeviation={layout.radius * CORNER_FADE_RATIO} />
        </filter>
        <mask id={maskId} maskUnits="userSpaceOnUse" x={0} y={0} width={layout.stageWidth} height={layout.stageHeight}>
          <rect width={layout.stageWidth} height={layout.stageHeight} fill="white" />
          <polygon
            points={[`${layout.centerX},${layout.centerY}`, ...cornerWedge.map((point) => `${point.x},${point.y}`)].join(' ')}
            fill="black"
            filter={`url(#${fadeId})`}
          />
        </mask>
        <radialGradient id={discGradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-disc-center)" />
          <stop offset="88%" stopColor="var(--color-disc-edge)" />
          <stop offset="100%" stopColor="var(--color-disc-rim)" />
        </radialGradient>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-accent-light)" />
          <stop offset="100%" stopColor="var(--color-accent)" />
        </linearGradient>
      </defs>

      <g mask={`url(#${maskId})`}>
        <circle className="ring__disc" cx={layout.centerX} cy={layout.centerY} r={layout.radius} fill={`url(#${discGradientId})`} />
        <circle className="ring__track" cx={layout.centerX} cy={layout.centerY} r={layout.radius} />
        <circle className="ring__inner" cx={layout.centerX} cy={layout.centerY} r={layout.radius - 22} />

        {Array.from({ length: 360 / MINOR_TICK_STEP_DEG }, (_, step) => {
          const angle = step * MINOR_TICK_STEP_DEG + ringRotation;
          const outer = pointOnRing(layout, angle, layout.radius);
          const inner = pointOnRing(layout, angle, layout.radius - MINOR_TICK_LENGTH_PX);
          return <line key={step} className="ring__minor-tick" x1={outer.x} y1={outer.y} x2={inner.x} y2={inner.y} />;
        })}

        <path className="ring__progress-track" d={describeArc(layout, PROGRESS_ARC_START_DEG, PROGRESS_ARC_SWEEP_DEG)} />
        {progressSweep > 0.5 && (
          <path className="ring__progress" d={describeArc(layout, PROGRESS_ARC_START_DEG, progressSweep)} stroke={`url(#${gradientId})`} />
        )}
        <circle className="ring__progress-knob" cx={progressEnd.x} cy={progressEnd.y} r={6} />

        <g className="ring__now">
          <line className="ring__now-tick" x1={nowOuter.x} y1={nowOuter.y} x2={nowInner.x} y2={nowInner.y} />
          <text className="ring__now-year" x={nowLabel.x} y={nowLabel.y - 6} textAnchor="middle">
            {currentYear}
          </text>
          <text className="ring__now-label" x={nowLabel.x} y={nowLabel.y + 12} textAnchor="middle">
            {NOW_LABEL}
          </text>
        </g>

        {experiences.map((experience, index) => {
          const angle = tickAngleFor(index, position);
          const outer = pointOnRing(layout, angle, layout.radius + 4);
          const inner = pointOnRing(layout, angle, layout.radius - MAJOR_TICK_LENGTH_PX);
          const label = pointOnRing(layout, angle, layout.radius - LABEL_INSET_PX);
          const pin = pointOnRing(layout, angle);
          const isActive = index === activeIndex;
          return (
            <g key={experience.id} className={`ring__stop ${isActive ? 'is-active' : ''}`} onClick={() => onSelect(index)}>
              <line className="ring__major-tick" x1={outer.x} y1={outer.y} x2={inner.x} y2={inner.y} />
              <circle className="ring__pin" cx={pin.x} cy={pin.y} r={isActive ? 6 : 4} />
              <text className="ring__year" x={label.x} y={label.y - 6} textAnchor="middle">
                {startYearOf(experience)}
              </text>
              <text className="ring__company" x={label.x} y={label.y + 12} textAnchor="middle">
                {experience.tag?.company ?? experience.company}
              </text>
            </g>
          );
        })}
      </g>

      {!layout.isPortrait && <circle className="ring__slot" cx={attachPoint.x} cy={attachPoint.y} r={9} />}
      <circle
        className="ring__hit"
        cx={layout.centerX}
        cy={layout.centerY}
        r={layout.radius}
        strokeWidth={HIT_STROKE_PX}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
    </svg>
  );
}
