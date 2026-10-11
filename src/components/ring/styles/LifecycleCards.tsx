import { useEffect, useRef, useState } from 'react';
import type * as THREE from 'three';
import type { CardMotionMemory, LifecycleMotion, RingCard } from '../../../utils/cardMotion';
import { arrivalStartPoint, CARD_PHASES, DEPART_LIFETIME_MS, DEPARTURES, nowSeconds, resolveLifecycleAnchor } from '../../../utils/cardMotion';
import type { RingLayout } from '../../../utils/ringLayout';
import { Lanyard } from '../Lanyard';
import type { RingStyleProps } from './styleProps';
import { cardSizing } from './styleProps';

interface LifecycleCardsProps extends RingStyleProps {
  motion: LifecycleMotion;
}

// One card per experience change: the new one arrives from the disc while the old one leaves in the chosen way.
export function LifecycleCards({ layout, textures, activeIndex, positionRef, onHoldChange, onSelectCard, motion }: LifecycleCardsProps) {
  const cards = useLifecycleCards(activeIndex, layout, motion);
  const memories = useRef(new Map<number, CardMotionMemory>());
  const sizing = cardSizing(layout);

  // Returns the per-card scratch memory, creating it on first use.
  const memoryFor = (key: number): CardMotionMemory => {
    const existing = memories.current.get(key);
    if (existing) return existing;
    const created: CardMotionMemory = {};
    memories.current.set(key, created);
    return created;
  };

  return (
    <>
      {cards.map((card) => {
        const memory = memoryFor(card.key);
        const isHanging = card.phase === CARD_PHASES.hanging;
        const cardTextures = textures[card.index];
        const getAnchor = (target: THREE.Vector3) => {
          target.set(...resolveLifecycleAnchor(card, layout, positionRef.current, memory, nowSeconds(), motion));
        };
        return (
          <Lanyard
            key={card.key}
            anchor={card.spawn}
            {...sizing}
            frontTexture={cardTextures.front}
            backTexture={cardTextures.back}
            bandTexture={cardTextures.band}
            edgeColor={cardTextures.edgeColor}
            getAnchor={getAnchor}
            isInteractive={isHanging}
            isTumbling={!isHanging && motion.departure === DEPARTURES.fall}
            onHoldChange={isHanging ? onHoldChange : undefined}
            onSelect={isHanging ? onSelectCard : undefined}
          />
        );
      })}
    </>
  );
}

// Keeps one hanging card for the active experience and lets replaced cards depart before removing them.
function useLifecycleCards(activeIndex: number, layout: RingLayout, motion: LifecycleMotion): RingCard[] {
  const nextKey = useRef(1);
  const layoutRef = useRef(layout);
  const [cards, setCards] = useState<RingCard[]>(() => [
    { key: 0, index: activeIndex, phase: CARD_PHASES.hanging, phaseStartedAt: nowSeconds(), spawn: arrivalStartPoint(layout, motion.arrival) },
  ]);

  useEffect(() => {
    layoutRef.current = layout;
  }, [layout]);

  useEffect(() => {
    const now = nowSeconds();
    const key = nextKey.current++;
    setCards((previous) => {
      if (previous.some((card) => card.phase === CARD_PHASES.hanging && card.index === activeIndex)) return previous;
      const departing = previous.map((card) =>
        card.phase === CARD_PHASES.hanging ? { ...card, phase: CARD_PHASES.departing, phaseStartedAt: now } : card,
      );
      const arriving: RingCard = {
        key,
        index: activeIndex,
        phase: CARD_PHASES.hanging,
        phaseStartedAt: now,
        spawn: arrivalStartPoint(layoutRef.current, motion.arrival),
      };
      return [...departing, arriving];
    });
  }, [activeIndex, motion.arrival]);

  useEffect(() => {
    if (!cards.some((card) => card.phase === CARD_PHASES.departing)) return;
    const timer = window.setTimeout(() => {
      const now = nowSeconds();
      setCards((previous) =>
        previous.filter((card) => card.phase !== CARD_PHASES.departing || (now - card.phaseStartedAt) * 1000 < DEPART_LIFETIME_MS),
      );
    }, DEPART_LIFETIME_MS);
    return () => window.clearTimeout(timer);
  }, [cards]);

  return cards;
}
