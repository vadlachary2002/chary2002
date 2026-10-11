import { useMemo } from 'react';
import type * as THREE from 'three';
import { badgePalette, CARD_FINISHES, cardFinishes } from '../config/theme';
import type { Experience } from '../types/profile';
import { createBadgeBack, createBandTexture, createExperienceCardFront } from '../utils/badgeTextures';
import { monogramOf, periodWithDuration, strapLabelOf } from '../utils/experience';
import { useImageElements } from './useImageElements';

export interface ExperienceTextures {
  front: THREE.CanvasTexture;
  back: THREE.CanvasTexture;
  band: THREE.CanvasTexture;
  edgeColor: string;
}

// Draws front, back and strap textures for every experience in its card finish, redrawing once logos load.
export function useExperienceTextures(experiences: Experience[]): ExperienceTextures[] {
  const logoUrls = useMemo(() => experiences.flatMap((experience) => (experience.logoUrl ? [experience.logoUrl] : [])), [experiences]);
  const logos = useImageElements(logoUrls);

  return useMemo(
    () =>
      experiences.map((experience, index) => {
        const finish = cardFinishes[experience.cardFinish ?? CARD_FINISHES.silver];
        const period = periodWithDuration(experience);
        return {
          edgeColor: finish.edge,
          front: createExperienceCardFront({
            finish,
            logo: experience.logoUrl ? logos.get(experience.logoUrl) : undefined,
            monogram: monogramOf(experience.company),
            company: experience.company,
            title: experience.title,
            period,
            isCurrent: index === 0,
            sequenceLabel: `EXPERIENCE ${String(index + 1).padStart(2, '0')} / ${String(experiences.length).padStart(2, '0')}`,
          }),
          back: createBadgeBack({ heading: experience.tag?.company ?? experience.company, lines: [experience.title, period], finish }),
          band: createBandTexture({ label: strapLabelOf(experience), background: badgePalette.accent, foreground: badgePalette.onAccent }),
        };
      }),
    [experiences, logos],
  );
}
