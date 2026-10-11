import { useEffect, useState } from 'react';
import type * as THREE from 'three';
import { slotAnchorPoint } from '../../../utils/cardMotion';
import { Lanyard } from '../Lanyard';
import type { RingStyleProps } from './styleProps';
import { cardSizing } from './styleProps';

const FACE_SWAP_DELAY_MS = 140;

// A single card on a fixed strap that spins like a tossed coin and lands on the next experience.
export function FlipCard({ layout, textures, activeIndex, onHoldChange, onSelectCard }: RingStyleProps) {
  const [shownIndex, setShownIndex] = useState(activeIndex);
  const [initialAnchor] = useState(() => slotAnchorPoint(layout));
  const shownTextures = textures[shownIndex];

  useEffect(() => {
    if (activeIndex === shownIndex) return;
    const timer = window.setTimeout(() => setShownIndex(activeIndex), FACE_SWAP_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [activeIndex, shownIndex]);

  // Keeps the strap clipped to the ring's bottom slot.
  const getAnchor = (target: THREE.Vector3) => {
    target.set(...slotAnchorPoint(layout));
  };

  return (
    <Lanyard
      anchor={initialAnchor}
      {...cardSizing(layout)}
      frontTexture={shownTextures.front}
      backTexture={shownTextures.back}
      bandTexture={shownTextures.band}
      edgeColor={shownTextures.edgeColor}
      getAnchor={getAnchor}
      spinSignal={activeIndex}
      onHoldChange={onHoldChange}
      onSelect={onSelectCard}
    />
  );
}
