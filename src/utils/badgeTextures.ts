import * as THREE from 'three';
import type { CardFinish } from '../config/theme';
import { badgePalette } from '../config/theme';

export const DISPLAY_FONT = '"Space Grotesk"';
export const BODY_FONT = '"Inter"';
export const TEXTURE_FONT_DESCRIPTORS = [`700 64px ${DISPLAY_FONT}`, `600 32px ${BODY_FONT}`, `500 32px ${BODY_FONT}`];

const CARD_TEXTURE_WIDTH = 1024;
const CARD_TEXTURE_HEIGHT = 1440;
const CARD_PADDING = 96;
const BAND_TEXTURE_WIDTH = 2048;
const BAND_TEXTURE_HEIGHT = 128;
export const BAND_TEXTURE_ASPECT = BAND_TEXTURE_WIDTH / BAND_TEXTURE_HEIGHT;
const MAX_ANISOTROPY = 8;
const CURRENT_STATUS_LABEL = 'CURRENT';
const LOGO_MAX_HEIGHT = 96;
const LOGO_MAX_WIDTH = 420;
const TITLE_TOP = 440;
const BRUSH_LINE_SPACING = 3;
const FOIL_INSET = 40;
const FOIL_WIDTH = 16;
const FOIL_CROSS_OVERHANG = 26;
const FOIL_CORNER_RADIUS = 36;

export interface BadgeBackContent {
  heading: string;
  lines: string[];
  finish: CardFinish;
}

export interface ExperienceCardContent {
  company: string;
  title: string;
  period: string;
  isCurrent: boolean;
  sequenceLabel: string;
  monogram: string;
  finish: CardFinish;
  logo?: HTMLImageElement;
}

export interface BandStyle {
  label: string;
  background: string;
  foreground: string;
}

// Creates a 2D canvas of the given size and returns its context.
function createCanvasContext(width: number, height: number): CanvasRenderingContext2D {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('2D canvas is not supported');
  return context;
}

// Wraps a drawn canvas in a colour-correct Three.js texture.
function toTexture(context: CanvasRenderingContext2D): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(context.canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = MAX_ANISOTROPY;
  return texture;
}

// Builds a diagonal gradient through the given colour stops.
function diagonalGradient(context: CanvasRenderingContext2D, stops: string[]): CanvasGradient {
  const { width, height } = context.canvas;
  const gradient = context.createLinearGradient(0, 0, width, height);
  stops.forEach((color, index) => gradient.addColorStop(index / (stops.length - 1), color));
  return gradient;
}

// Paints a brushed-metal base in the card's finish: banded gradient with fine horizontal grain.
function paintCardBase(context: CanvasRenderingContext2D, finish: CardFinish): void {
  const { width, height } = context.canvas;
  context.fillStyle = diagonalGradient(context, finish.baseStops);
  context.fillRect(0, 0, width, height);
  context.fillStyle = badgePalette.brushLine;
  let seed = 3;
  for (let y = 0; y < height; y += BRUSH_LINE_SPACING) {
    seed = (seed * 37 + 17) % 101;
    context.globalAlpha = 0.15 + (seed % 10) / 20;
    context.fillRect(0, y, width, 1);
  }
  context.globalAlpha = 1;
  paintFoilFrame(context, finish);
}

// Paints a gold foil frame inset from the edge whose lines cross past each corner.
function paintFoilFrame(context: CanvasRenderingContext2D, finish: CardFinish): void {
  const { width, height } = context.canvas;
  const left = FOIL_INSET;
  const top = FOIL_INSET;
  const right = width - FOIL_INSET;
  const bottom = height - FOIL_INSET;
  context.strokeStyle = diagonalGradient(context, finish.foilStops);
  context.lineWidth = FOIL_WIDTH;
  context.beginPath();
  context.roundRect(left, top, right - left, bottom - top, FOIL_CORNER_RADIUS);
  context.stroke();

  context.lineWidth = FOIL_WIDTH / 2;
  const crossInset = left + FOIL_CORNER_RADIUS * 1.6;
  [
    [crossInset, top - FOIL_CROSS_OVERHANG, crossInset, top + FOIL_CROSS_OVERHANG * 2],
    [left - FOIL_CROSS_OVERHANG, top + FOIL_CORNER_RADIUS * 1.6, left + FOIL_CROSS_OVERHANG * 2, top + FOIL_CORNER_RADIUS * 1.6],
    [width - crossInset, bottom + FOIL_CROSS_OVERHANG, width - crossInset, bottom - FOIL_CROSS_OVERHANG * 2],
    [right + FOIL_CROSS_OVERHANG, bottom - FOIL_CORNER_RADIUS * 1.6, right - FOIL_CROSS_OVERHANG * 2, bottom - FOIL_CORNER_RADIUS * 1.6],
  ].forEach(([fromX, fromY, toX, toY]) => {
    context.beginPath();
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.stroke();
  });
}

// Paints the lanyard slot cut-out near the top edge.
function paintLanyardSlot(context: CanvasRenderingContext2D): void {
  const slotWidth = context.canvas.width * 0.22;
  context.fillStyle = badgePalette.slot;
  context.beginPath();
  context.roundRect((context.canvas.width - slotWidth) / 2, 48, slotWidth, 30, 15);
  context.fill();
}

// Paints a decorative barcode strip along the bottom of the card.
function paintBarcode(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
  context.fillStyle = badgePalette.inkMuted;
  let cursor = x;
  let seed = 7;
  while (cursor < x + width) {
    seed = (seed * 31 + 11) % 97;
    const barWidth = 3 + (seed % 4) * 3;
    context.fillRect(cursor, y, barWidth, height);
    cursor += barWidth + 4 + (seed % 3) * 3;
  }
}

// Paints a company logo scaled to fit the logo box, keeping its aspect ratio.
function paintLogo(context: CanvasRenderingContext2D, logo: HTMLImageElement, x: number, y: number): void {
  const ratio = Math.min(LOGO_MAX_WIDTH / logo.naturalWidth, LOGO_MAX_HEIGHT / logo.naturalHeight);
  context.drawImage(logo, x, y, logo.naturalWidth * ratio, logo.naturalHeight * ratio);
}

// Paints a rounded monogram tile used when a company has no logo.
function paintMonogram(context: CanvasRenderingContext2D, monogram: string, x: number, y: number): void {
  context.fillStyle = badgePalette.accent;
  context.beginPath();
  context.roundRect(x, y, LOGO_MAX_HEIGHT, LOGO_MAX_HEIGHT, 24);
  context.fill();
  context.fillStyle = badgePalette.onAccent;
  context.font = `700 44px ${DISPLAY_FONT}`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(monogram, x + LOGO_MAX_HEIGHT / 2, y + LOGO_MAX_HEIGHT / 2 + 3);
  context.textAlign = 'left';
  context.textBaseline = 'alphabetic';
}

// Splits text into lines that fit within maxWidth at the current font.
function wrapWords(context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let currentLine = '';
  text.split(' ').forEach((word) => {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (currentLine && context.measureText(candidate).width > maxWidth) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = candidate;
    }
  });
  if (currentLine) lines.push(currentLine);
  return lines;
}

// Paints a small rounded status pill such as "CURRENT".
function paintStatusPill(context: CanvasRenderingContext2D, label: string, rightX: number, y: number): void {
  context.font = `700 34px ${BODY_FONT}`;
  const pillWidth = context.measureText(label).width + 72;
  context.fillStyle = badgePalette.accent;
  context.beginPath();
  context.roundRect(rightX - pillWidth, y - 44, pillWidth, 64, 32);
  context.fill();
  context.fillStyle = badgePalette.onAccent;
  context.beginPath();
  context.arc(rightX - pillWidth + 30, y - 12, 8, 0, Math.PI * 2);
  context.fill();
  context.textAlign = 'left';
  context.fillText(label, rightX - pillWidth + 48, y);
}

// Draws the front face of an experience card: logo, title, company underneath, then dates.
export function createExperienceCardFront(content: ExperienceCardContent): THREE.CanvasTexture {
  const context = createCanvasContext(CARD_TEXTURE_WIDTH, CARD_TEXTURE_HEIGHT);
  const textWidth = CARD_TEXTURE_WIDTH - CARD_PADDING * 2;
  paintCardBase(context, content.finish);
  paintLanyardSlot(context);
  if (content.logo) {
    paintLogo(context, content.logo, CARD_PADDING, 150);
  } else {
    paintMonogram(context, content.monogram, CARD_PADDING, 150);
  }
  if (content.isCurrent) paintStatusPill(context, CURRENT_STATUS_LABEL, CARD_TEXTURE_WIDTH - CARD_PADDING, 222);

  context.fillStyle = badgePalette.ink;
  context.textAlign = 'left';
  context.textBaseline = 'alphabetic';
  context.font = `700 112px ${DISPLAY_FONT}`;
  let titleLines = wrapWords(context, content.title, textWidth);
  const titleFontSize = titleLines.length > 3 ? 92 : 112;
  const titleLineHeight = titleFontSize * 1.08;
  context.font = `700 ${titleFontSize}px ${DISPLAY_FONT}`;
  titleLines = wrapWords(context, content.title, textWidth);
  titleLines.forEach((line, index) => context.fillText(line, CARD_PADDING, TITLE_TOP + index * titleLineHeight));

  const companyBaseline = TITLE_TOP + (titleLines.length - 1) * titleLineHeight + 104;
  context.fillStyle = badgePalette.accent;
  context.font = `600 64px ${DISPLAY_FONT}`;
  context.fillText(content.company, CARD_PADDING, companyBaseline);

  context.fillStyle = badgePalette.inkMuted;
  context.font = `500 48px ${BODY_FONT}`;
  context.fillText(content.period, CARD_PADDING, CARD_TEXTURE_HEIGHT - 290);

  context.fillStyle = badgePalette.accent;
  context.fillRect(0, CARD_TEXTURE_HEIGHT - 200, CARD_TEXTURE_WIDTH, 6);
  paintBarcode(context, CARD_PADDING, CARD_TEXTURE_HEIGHT - 150, 360, 70);
  context.fillStyle = badgePalette.inkMuted;
  context.font = `600 34px ${BODY_FONT}`;
  context.textAlign = 'right';
  context.fillText(content.sequenceLabel, CARD_TEXTURE_WIDTH - CARD_PADDING, CARD_TEXTURE_HEIGHT - 95);
  return toTexture(context);
}

// Draws the back face of a card with a heading and a few lines.
export function createBadgeBack(content: BadgeBackContent): THREE.CanvasTexture {
  const context = createCanvasContext(CARD_TEXTURE_WIDTH, CARD_TEXTURE_HEIGHT);
  paintCardBase(context, content.finish);
  paintLanyardSlot(context);

  context.strokeStyle = badgePalette.inkFaint;
  context.lineWidth = 2;
  for (let offset = -CARD_TEXTURE_HEIGHT; offset < CARD_TEXTURE_WIDTH; offset += 48) {
    context.beginPath();
    context.moveTo(offset, 0);
    context.lineTo(offset + CARD_TEXTURE_HEIGHT, CARD_TEXTURE_HEIGHT);
    context.stroke();
  }

  context.fillStyle = badgePalette.accentText;
  context.font = `700 84px ${DISPLAY_FONT}`;
  context.textAlign = 'left';
  context.fillText(content.heading, CARD_PADDING, 300);
  context.fillStyle = badgePalette.ink;
  context.font = `500 44px ${BODY_FONT}`;
  content.lines.forEach((line, index) => context.fillText(line, CARD_PADDING, 440 + index * 96));
  return toTexture(context);
}

// Draws the repeating printed strap texture so its ends tile seamlessly.
export function createBandTexture(style: BandStyle): THREE.CanvasTexture {
  const context = createCanvasContext(BAND_TEXTURE_WIDTH, BAND_TEXTURE_HEIGHT);
  context.fillStyle = style.background;
  context.fillRect(0, 0, BAND_TEXTURE_WIDTH, BAND_TEXTURE_HEIGHT);
  context.fillStyle = style.foreground;
  context.font = `700 64px ${DISPLAY_FONT}`;
  context.textBaseline = 'middle';
  const segment = `${style.label}   •   `;
  const segmentWidth = context.measureText(segment).width;
  const segmentCount = Math.max(1, Math.round(BAND_TEXTURE_WIDTH / segmentWidth));
  const stretch = BAND_TEXTURE_WIDTH / (segmentCount * segmentWidth);
  context.setTransform(stretch, 0, 0, 1, 0, 0);
  for (let index = 0; index < segmentCount; index++) {
    context.fillText(segment, index * segmentWidth, BAND_TEXTURE_HEIGHT / 2 + 4);
  }
  context.setTransform(1, 0, 0, 1, 0, 0);
  const texture = toTexture(context);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}
