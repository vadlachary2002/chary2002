import * as THREE from 'three';
import { CARD_DEPTH, CARD_HEIGHT, CARD_WIDTH } from '../config/card';

const CARD_CORNER_RADIUS = 0.12;

// Builds a rounded rectangle centred on the origin.
function createRoundedRectShape(width: number, height: number, radius: number): THREE.Shape {
  const left = -width / 2;
  const bottom = -height / 2;
  const shape = new THREE.Shape();
  shape.moveTo(left + radius, bottom);
  shape.lineTo(left + width - radius, bottom);
  shape.quadraticCurveTo(left + width, bottom, left + width, bottom + radius);
  shape.lineTo(left + width, bottom + height - radius);
  shape.quadraticCurveTo(left + width, bottom + height, left + width - radius, bottom + height);
  shape.lineTo(left + radius, bottom + height);
  shape.quadraticCurveTo(left, bottom + height, left, bottom + height - radius);
  shape.lineTo(left, bottom + radius);
  shape.quadraticCurveTo(left, bottom, left + radius, bottom);
  return shape;
}

// Remaps shape-space UVs to 0..1 so a full texture covers the face.
function normalizeFaceUVs(geometry: THREE.BufferGeometry, width: number, height: number): void {
  const positions = geometry.getAttribute('position');
  const uvs = new Float32Array(positions.count * 2);
  for (let index = 0; index < positions.count; index++) {
    uvs[index * 2] = positions.getX(index) / width + 0.5;
    uvs[index * 2 + 1] = positions.getY(index) / height + 0.5;
  }
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
}

// Creates the textured front/back face geometry for a badge card.
export function createCardFaceGeometry(): THREE.ShapeGeometry {
  const geometry = new THREE.ShapeGeometry(createRoundedRectShape(CARD_WIDTH, CARD_HEIGHT, CARD_CORNER_RADIUS), 12);
  normalizeFaceUVs(geometry, CARD_WIDTH, CARD_HEIGHT);
  return geometry;
}

// Creates the thin solid body that gives the card visible edges.
export function createCardBodyGeometry(): THREE.ExtrudeGeometry {
  const geometry = new THREE.ExtrudeGeometry(createRoundedRectShape(CARD_WIDTH, CARD_HEIGHT, CARD_CORNER_RADIUS), {
    depth: CARD_DEPTH,
    bevelEnabled: false,
    curveSegments: 12,
  });
  geometry.translate(0, 0, -CARD_DEPTH / 2);
  return geometry;
}
