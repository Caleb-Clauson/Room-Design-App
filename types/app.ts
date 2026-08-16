export type RoomType = 'kitchen' | 'laundry' | 'home-office' | 'floral';

export type TransformMode = 'translate' | 'rotate';

export type SceneAsset = {
  id: string;
  name: string;
  vendor: 'Ferguson Homes' | 'Home Goods' | 'Studio Internal';
  category: string;
  roomType: RoomType;
  color: string;
  dimensions: { w: number; h: number; d: number };
  url: string;
  shape: 'box' | 'cylinder';
  metallic?: number;
  roughness?: number;
  collisionLock?: 'island' | 'wall' | null;
};

export type SceneNode = {
  id: string;
  assetId: string;
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  lockedTo?: 'island' | 'wall' | null;
};

export type StructuralNode = {
  id: string;
  type: 'wall' | 'door' | 'window';
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number, number];
};

export type WorkspaceProject = {
  id: string;
  userId: string;
  name: string;
  roomType: RoomType;
  roomBounds: { width: number; depth: number; height: number };
  nodes: SceneNode[];
  structures: StructuralNode[];
  createdAt: string;
  updatedAt: string;
};
