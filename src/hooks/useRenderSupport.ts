import { useMemo } from 'react';
import { isWebGLAvailable, prefersReducedMotion } from '../utils/webgl';

const FORCE_OFF_PARAM = 'webgl';
const FORCE_OFF_VALUE = 'off';

export interface RenderSupport {
  canRender3D: boolean;
  isWebGLMissing: boolean;
}

// In development, "?webgl=off" simulates a browser without WebGL so the notice can be previewed.
function isWebGLForcedOffInDevelopment(): boolean {
  return import.meta.env.DEV && new URLSearchParams(window.location.search).get(FORCE_OFF_PARAM) === FORCE_OFF_VALUE;
}

// Decides once whether the 3D cards can render, and whether that's because WebGL is unavailable.
export function useRenderSupport(): RenderSupport {
  return useMemo(() => {
    const isWebGLMissing = !isWebGLAvailable() || isWebGLForcedOffInDevelopment();
    return { canRender3D: !isWebGLMissing && !prefersReducedMotion(), isWebGLMissing };
  }, []);
}
