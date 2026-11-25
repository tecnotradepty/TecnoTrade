export type ProductCategory = 
  | "iPhone" 
  | "Samsung" 
  | "Honor" 
  | "Xiaomi" 
  | "Pixel" 
  | "Covers & Fundas" 
  | "Accesorios" 
  | "Otros";

export const MAX_PRODUCT_IMAGES = 3;
export const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80";

export interface InventoryProduct {
  id: string;
  category: ProductCategory;
  name: string;
  subtitle: string;
  description?: string;
  price: number;
  grade?: string;
  battery?: string;
  tag?: string;
  colors?: string[];
  image: string;
  images?: string[];
  inStock: boolean;
  createdAt?: string;
}

/**
 * Normaliza y deduplica una lista de URLs/DataURLs de producto con límite máximo de 3 fotos.
 */
export function normalizeProductImages(images?: unknown, fallbackImage?: unknown): string[] {
  const candidates: string[] = [];

  if (Array.isArray(images)) {
    for (const item of images) {
      if (typeof item === "string" && item.trim()) {
        candidates.push(item.trim());
      }
    }
  }

  if (candidates.length === 0 && typeof fallbackImage === "string" && fallbackImage.trim()) {
    candidates.push(fallbackImage.trim());
  }

  const unique: string[] = [];
  for (const url of candidates) {
    if (!unique.includes(url)) {
      unique.push(url);
    }
    if (unique.length >= MAX_PRODUCT_IMAGES) break;
  }

  return unique;
}

/**
 * Devuelve la galería del producto (1 a 3 imágenes) asegurando al menos la imagen de respaldo.
 */
export function getProductImages(product: Pick<InventoryProduct, "image" | "images">): string[] {
  const list = normalizeProductImages(product.images, product.image);
  if (list.length === 0) {
    return [DEFAULT_PRODUCT_IMAGE];
  }
  return list;
}
