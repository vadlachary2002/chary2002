const TILE_WIDTH = 360;
const TILE_HEIGHT = 200;
const TILT_DEGREES = -24;
const TEXT_COLOR = 'rgba(20,20,30,0.09)';

// Builds a CSS url() for a tiled, tilted text watermark.
export function buildWatermarkImage(text: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${TILE_WIDTH}' height='${TILE_HEIGHT}'><text x='0' y='120' transform='rotate(${TILT_DEGREES} ${TILE_WIDTH / 2} ${TILE_HEIGHT / 2})' font-family='sans-serif' font-size='16' fill='${TEXT_COLOR}'>${text}</text></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
