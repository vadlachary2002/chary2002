import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, RefObject } from 'react';
import type { TransitionStyle } from '../../config/transitions';
import type { CardHold } from '../../types/cardHold';
import { RELEASED_HOLD } from '../../types/cardHold';
import { profile } from '../../data/profile';
import { useElementSize } from '../../hooks/useElementSize';
import { useGearSound } from '../../hooks/useGearSound';
import { useRenderSupport } from '../../hooks/useRenderSupport';
import { useScrollTimeline } from '../../hooks/useScrollTimeline';
import { useSteppedIndex } from '../../hooks/useSteppedIndex';
import { computeRingLayout } from '../../utils/ringLayout';
import { scrollToExperience } from '../../utils/scroll';
import { HeroCopy } from '../hero/HeroCopy';
import { ExperienceDetail } from './ExperienceDetail';
import { ExperienceRing } from './ExperienceRing';
import { DragHint } from './DragHint';
import { RingCardFallback } from './RingCardFallback';
import { WebGLNotice } from './WebGLNotice';

const RingCardScene = lazy(() => import('./RingCardScene'));
const SCROLL_PER_EXPERIENCE_SVH = 70;

interface RingHeroProps {
  transitionStyle: TransitionStyle;
}

// Pinned hero where scrolling or turning the ring walks back through each experience.
export function RingHero({ transitionStyle }: RingHeroProps) {
  const experiences = profile.experiences;
  const wrapperRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const isCardGrabbedRef = useRef(false);
  const { canRender3D, isWebGLMissing } = useRenderSupport();
  const stageSize = useElementSize(stageRef);
  const { position, positionRef, scrollToPosition } = useScrollTimeline(wrapperRef, experiences.length);
  const activeIndex = useSteppedIndex(position);
  const gearSound = useGearSound(position);
  const layout = useMemo(() => computeRingLayout(stageSize.width, stageSize.height), [stageSize.width, stageSize.height]);
  const wrapperStyle = { '--ring-scroll-length': `${(experiences.length - 1) * SCROLL_PER_EXPERIENCE_SVH}svh` } as CSSProperties;

  const [cardHold, setCardHold] = useState<CardHold>(RELEASED_HOLD);
  useBlockScrollWhileHolding(stageRef, isCardGrabbedRef);
  const handleHoldChange = useCallback((hold: CardHold) => {
    isCardGrabbedRef.current = hold.isHeld;
    setCardHold(hold);
  }, []);
  const handleSelectCard = useCallback(() => scrollToExperience(experiences[activeIndex].id), [experiences, activeIndex]);

  return (
    <header className="ring-hero" ref={wrapperRef} style={wrapperStyle}>
      <div className="ring-hero__stage" ref={stageRef}>
        {stageSize.width > 0 && (
          <>
            <ExperienceRing
              layout={layout}
              experiences={experiences}
              position={position}
              activeIndex={activeIndex}
              isCardGrabbedRef={isCardGrabbedRef}
              onRotate={scrollToPosition}
              onSettle={() => scrollToPosition(activeIndex)}
              onSelect={(index) => scrollToPosition(index)}
            />
            {canRender3D ? (
              <Suspense fallback={null}>
                <RingCardScene
                  eventSource={stageRef as RefObject<HTMLElement>}
                  layout={layout}
                  experiences={experiences}
                  activeIndex={activeIndex}
                  positionRef={positionRef}
                  transitionStyle={transitionStyle}
                  onHoldChange={handleHoldChange}
                  onSelectCard={handleSelectCard}
                />
              </Suspense>
            ) : (
              <RingCardFallback layout={layout} experience={experiences[activeIndex]} />
            )}
          </>
        )}

        <HeroCopy>
          <p className="hero__hint">Scroll, or turn the ring, to travel back through my experience.</p>
        </HeroCopy>

        <DragHint hold={cardHold} />

        {stageSize.width > 0 && (
          <ExperienceDetail
            layout={layout}
            experience={experiences[activeIndex]}
            index={activeIndex}
            total={experiences.length}
            onStep={(direction) => scrollToPosition(activeIndex + direction)}
            isSoundOn={gearSound.isEnabled}
            onToggleSound={gearSound.toggle}
          />
        )}
      </div>
      {isWebGLMissing && <WebGLNotice />}
    </header>
  );
}

// Stops a touch drag on a held card from also scrolling the page.
function useBlockScrollWhileHolding(stageRef: RefObject<HTMLElement | null>, isHoldingRef: RefObject<boolean>): void {
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const blockScroll = (event: TouchEvent) => {
      if (isHoldingRef.current) event.preventDefault();
    };
    stage.addEventListener('touchmove', blockScroll, { passive: false });
    return () => stage.removeEventListener('touchmove', blockScroll);
  }, [stageRef, isHoldingRef]);
}
