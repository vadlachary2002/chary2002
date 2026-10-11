import type { RefObject } from 'react';
import type { ExperienceTextures } from '../../../hooks/useExperienceTextures';
import type { CardHold } from '../../../types/cardHold';
import type { Experience } from '../../../types/profile';
import type { RingLayout } from '../../../utils/ringLayout';

export interface RingStyleProps {
  layout: RingLayout;
  experiences: Experience[];
  textures: ExperienceTextures[];
  activeIndex: number;
  positionRef: RefObject<number>;
  onHoldChange: (hold: CardHold) => void;
  onSelectCard: () => void;
}

export interface CardSizing {
  scale: number;
  strapLength: number;
  bandWidth: number;
}

// Card and strap size for a style, scaled from the layout's default card.
export function cardSizing(layout: RingLayout, sizeRatio = 1, strapRatio = 1): CardSizing {
  return { scale: layout.cardScale * sizeRatio, strapLength: layout.strapLength * strapRatio, bandWidth: layout.strapWidth * sizeRatio };
}
