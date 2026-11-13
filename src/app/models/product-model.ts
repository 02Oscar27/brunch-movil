export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  imagen: string;
  ingredientes: string[];
  rating?: number;
}

export interface CartItem {
  producto: Product;
  cantidad: number;
}
