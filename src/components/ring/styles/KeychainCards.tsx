import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { badgePalette } from '../../../config/theme';
import { railPath, railPlacement } from '../../../utils/cardMotion';
import type { RingLayout } from '../../../utils/ringLayout';
import { GENTLE_ANCHOR_SPEED, Lanyard } from '../Lanyard';
import type { RingStyleProps } from './styleProps';
import { cardSizing } from './styleProps';

const KEY_SIZE_RATIO = 0.62;
const FRONT_KEY_SIZE_RATIO = 0.95;
const KEY_STRAP_RATIO = 0.55;
const RAIL_TUBE_RADIUS = 0.035;
const RAIL_SEGMENTS = 128;

// Cards hang like keys on a U-shaped rail: scrolling carries the front card back around the loop and brings the next one forward.
export function KeychainCards({ layout, textures, activeIndex, positionRef, onHoldChange, onSelectCard }: RingStyleProps) {
  const sizing = cardSizing(layout, KEY_SIZE_RATIO, KEY_STRAP_RATIO);
  const frontScale = layout.cardScale * FRONT_KEY_SIZE_RATIO;
  const count = textures.length;
  const [initialAnchors] = useState(() => textures.map((_, index) => railPlacement(layout, index, positionRef.current, count).anchor));

  return (
    <>
      <KeyRail layout={layout} />
      {textures.map((cardTextures, index) => {
        const isFront = index === activeIndex;
        const getAnchor = (target: THREE.Vector3) => {
          target.set(...railPlacement(layout, index, positionRef.current, count).anchor);
        };
        const getYaw = () => railPlacement(layout, index, positionRef.current, count).yaw;
        return (
          <Lanyard
            key={index}
            anchor={initialAnchors[index]}
            {...sizing}
            scale={isFront ? frontScale : sizing.scale}
            frontTexture={cardTextures.front}
            backTexture={cardTextures.back}
            bandTexture={cardTextures.band}
            edgeColor={cardTextures.edgeColor}
            getAnchor={getAnchor}
            getYaw={getYaw}
            maxAnchorSpeed={GENTLE_ANCHOR_SPEED}
            isInteractive={isFront}
            onHoldChange={isFront ? onHoldChange : undefined}
            onSelect={isFront ? onSelectCard : undefined}
          />
        );
      })}
    </>
  );
}

// Thin polished metal loop the keys hang from, traced through the same points the keys ride on.
function KeyRail({ layout }: { layout: RingLayout }) {
  const geometry = useMemo(() => {
    const points = railPath(layout).map(([x, y, z]) => new THREE.Vector3(x, y, z));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points, true), RAIL_SEGMENTS, RAIL_TUBE_RADIUS, 8, true);
  }, [layout]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={badgePalette.railMetal} metalness={0.9} roughness={0.25} />
    </mesh>
  );
}
