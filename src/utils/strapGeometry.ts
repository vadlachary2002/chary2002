import * as THREE from 'three';

const VIEW_NORMAL = new THREE.Vector3(0, 0, 1);
const MIN_TANGENT_LENGTH_SQ = 1e-10;

// Allocates an indexed ribbon with two vertices per centreline point.
export function createStrapGeometry(pointCount: number): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  const positions = new THREE.BufferAttribute(new Float32Array(pointCount * 2 * 3), 3);
  const uvs = new THREE.BufferAttribute(new Float32Array(pointCount * 2 * 2), 2);
  positions.setUsage(THREE.DynamicDrawUsage);
  uvs.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute('position', positions);
  geometry.setAttribute('uv', uvs);

  const indices: number[] = [];
  for (let index = 0; index < pointCount - 1; index++) {
    const left = index * 2;
    indices.push(left, left + 2, left + 1, left + 1, left + 2, left + 3);
  }
  geometry.setIndex(indices);
  return geometry;
}

// Rebuilds the camera-facing ribbon along the centreline, tiling the texture by real length.
export function updateStrapGeometry(geometry: THREE.BufferGeometry, centreline: THREE.Vector3[], width: number, tileLength: number): void {
  const positions = geometry.getAttribute('position') as THREE.BufferAttribute;
  const uvs = geometry.getAttribute('uv') as THREE.BufferAttribute;
  const tangent = new THREE.Vector3();
  const side = new THREE.Vector3(1, 0, 0);
  const halfWidth = width / 2;
  let travelled = 0;

  centreline.forEach((point, index) => {
    const previous = centreline[Math.max(index - 1, 0)];
    const next = centreline[Math.min(index + 1, centreline.length - 1)];
    tangent.subVectors(next, previous);
    if (tangent.lengthSq() > MIN_TANGENT_LENGTH_SQ) side.crossVectors(tangent, VIEW_NORMAL).normalize();
    if (index > 0) travelled += point.distanceTo(previous);

    positions.setXYZ(index * 2, point.x + side.x * halfWidth, point.y + side.y * halfWidth, point.z);
    positions.setXYZ(index * 2 + 1, point.x - side.x * halfWidth, point.y - side.y * halfWidth, point.z);
    uvs.setXY(index * 2, travelled / tileLength, 0);
    uvs.setXY(index * 2 + 1, travelled / tileLength, 1);
  });

  positions.needsUpdate = true;
  uvs.needsUpdate = true;
}
