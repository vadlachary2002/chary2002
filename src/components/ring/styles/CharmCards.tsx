import { useState } from 'react';
import type * as THREE from 'three';
import { charmAnchorPoint } from '../../../utils/cardMotion';
import { GENTLE_ANCHOR_SPEED, Lanyard } from '../Lanyard';
import type { RingStyleProps } from './styleProps';
import { cardSizing } from './styleProps';

const CHARM_SIZE_RATIO = 0.55;
const ACTIVE_CHARM_SIZE_RATIO = 0.95;
const CHARM_STRAP_RATIO = 0.7;

// Every card hangs from its own year like a charm; turning the disc carries them round and the active one steps forward.
export function CharmCards({ layout, textures, activeIndex, positionRef, onHoldChange, onSelectCard }: RingStyleProps) {
  const sizing = cardSizing(layout, CHARM_SIZE_RATIO, CHARM_STRAP_RATIO);
  const activeScale = layout.cardScale * ACTIVE_CHARM_SIZE_RATIO;
  const [initialAnchors] = useState(() => textures.map((_, index) => charmAnchorPoint(layout, index, positionRef.current, index === activeIndex)));

  return (
    <>
      {textures.map((cardTextures, index) => {
        const isActive = index === activeIndex;
        const getAnchor = (target: THREE.Vector3) => {
          target.set(...charmAnchorPoint(layout, index, positionRef.current, isActive));
        };
        return (
          <Lanyard
            key={index}
            anchor={initialAnchors[index]}
            {...sizing}
            scale={isActive ? activeScale : sizing.scale}
            frontTexture={cardTextures.front}
            backTexture={cardTextures.back}
            bandTexture={cardTextures.band}
            edgeColor={cardTextures.edgeColor}
            getAnchor={getAnchor}
            maxAnchorSpeed={GENTLE_ANCHOR_SPEED}
            isInteractive={isActive}
            onHoldChange={isActive ? onHoldChange : undefined}
            onSelect={isActive ? onSelectCard : undefined}
          />
        );
      })}
    </>
  );
}
