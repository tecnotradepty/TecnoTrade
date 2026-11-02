export type ProductCategory = 
  | "iPhone" 
  | "Samsung" 
  | "Honor" 
  | "Xiaomi" 
  | "Pixel" 
  | "Covers & Fundas" 
  | "Accesorios" 
  | "Otros";

export interface InventoryProduct {
  id: string;
  category: ProductCategory;
  name: string;
  subtitle: string;
  price: number;
  grade?: string;
  battery?: string;
  tag?: string;
  colors?: string[];
  image: string;
  inStock: boolean;
  createdAt?: string;
}
