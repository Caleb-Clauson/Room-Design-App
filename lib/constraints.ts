import type { SceneNode } from '@/types/app';

export function clampToRoom(
  position: [number, number, number],
  roomBounds: { width: number; depth: number },
  padding = 0.4,
): [number, number, number] {
  const [x, y, z] = position;
  const maxX = roomBounds.width / 2 - padding;
  const maxZ = roomBounds.depth / 2 - padding;
  return [Math.min(Math.max(x, -maxX), maxX), y, Math.min(Math.max(z, -maxZ), maxZ)];
}

export function collides(node: SceneNode, nextPos: [number, number, number], others: SceneNode[]): boolean {
  const threshold = 0.65;
  return others.some((other) => {
    if (other.id === node.id) return false;
    const dx = Math.abs(other.position[0] - nextPos[0]);
    const dz = Math.abs(other.position[2] - nextPos[2]);
    return dx < threshold && dz < threshold;
  });
}

export function enforceLock(node: SceneNode, islandPos: [number, number, number], roomWidth: number): [number, number, number] {
  if (node.lockedTo === 'island') {
    return [islandPos[0], islandPos[1], islandPos[2]];
  }
  if (node.lockedTo === 'wall') {
    return [-(roomWidth / 2) + 0.5, node.position[1], node.position[2]];
  }
  return node.position;
}
