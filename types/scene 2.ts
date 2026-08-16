export type CatalogProduct = {
  id: string;
  name: string;
  vendor: string;
  price: number;
  category: string;
  dimensions: string;
  imageUrl?: string;
  productUrl?: string;
  verifiedAt?: string;
};

export type SceneItem = CatalogProduct & {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  zIndex?: number;
};
