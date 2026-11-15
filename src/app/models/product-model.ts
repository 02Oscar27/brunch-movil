export const CATEGORIES = ['Desayunos', 'Especiales', 'Saludables'] as const;

export type Category = (typeof CATEGORIES)[number];

export function isCategory(value: unknown): value is Category {
  return typeof value === 'string' && (CATEGORIES as readonly string[]).includes(value);
}

export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: Category;
  precio: number;
  imagen: string;
  ingredientes: string[];
  rating?: number;
}

export interface CartItem {
  producto: Product;
  cantidad: number;
}
