export type SupplierName = 'Ferguson' | 'Article' | 'HomeGoods' | 'Kohler';

export type NormalizedProduct = {
  id: string;
  supplier: SupplierName;
  sku: string;
  name: string;
  category: 'Furniture' | 'Plumbing' | 'Lighting' | 'Appliances' | 'Cabinets' | 'Tile' | 'Flooring';
  price: number;
  dimensions: {
    width: number; // inches or meters
    height: number;
    depth: number;
  };
  finish: string;
  assetUrl: string; // Transparent PNG cutout or 3D GLTF model
  vendorUrl: string;
};

export type SceneObject = {
  id: string;
  productId?: string;
  name: string;
  category: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  price: number;
  supplier: SupplierName;
  sku: string;
  assetUrl: string;
  customMaterial?: string;
};

export type SurfaceMaterial = {
  id: string;
  type: 'tile' | 'flooring' | 'paint';
  name: string;
  coverageAreaSqFt: number;
  costPerSqFt: number;
  textureUrl: string;
};