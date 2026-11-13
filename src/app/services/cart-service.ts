import { Injectable, computed, signal } from '@angular/core';
import { CartItem, Product } from '../models/product-model';

const STORAGE_KEY = 'brunch-movil-cart-v1';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsState = signal<CartItem[]>(this.loadCart());
  readonly items = this.itemsState.asReadonly();
  readonly totalItems = computed(() => this.itemsState().reduce((sum, item) => sum + item.cantidad, 0));
  readonly total = computed(() =>
    this.itemsState().reduce((sum, item) => sum + item.producto.precio * item.cantidad, 0),
  );

  add(producto: Product): void {
    const current = this.itemsState();
    const found = current.find((item) => item.producto.id === producto.id);
    const updated = found
      ? current.map((item) => (item.producto.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item))
      : [...current, { producto, cantidad: 1 }];
    this.update(updated);
  }

  decrease(productId: number): void {
    const updated = this.itemsState()
      .map((item) => (item.producto.id === productId ? { ...item, cantidad: item.cantidad - 1 } : item))
      .filter((item) => item.cantidad > 0);
    this.update(updated);
  }

  remove(productId: number): void {
    this.update(this.itemsState().filter((item) => item.producto.id !== productId));
  }

  clear(): void {
    this.update([]);
  }

  private update(items: CartItem[]): void {
    this.itemsState.set(items);
    this.saveCart(items);
  }

  private loadCart(): CartItem[] {
    try {
      if (typeof localStorage === 'undefined') return [];
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      const parsed: unknown = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((item): item is CartItem => this.isValidCartItem(item));
    } catch {
      return [];
    }
  }

  private isValidCartItem(value: unknown): value is CartItem {
    if (!value || typeof value !== 'object') return false;
    const item = value as Partial<CartItem>;
    const product = item.producto;
    return (
      Number.isInteger(item.cantidad) && item.cantidad! > 0 &&
      !!product && Number.isInteger(product.id) &&
      typeof product.nombre === 'string' &&
      typeof product.descripcion === 'string' &&
      typeof product.categoria === 'string' &&
      Number.isFinite(product.precio) && product.precio >= 0 &&
      typeof product.imagen === 'string' &&
      Array.isArray(product.ingredientes)
    );
  }

  private saveCart(items: CartItem[]): void {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.warn('No se pudo guardar el carrito en el almacenamiento local.', error);
    }
  }
}
