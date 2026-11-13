import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, shareReplay, timeout } from 'rxjs';
import { Product } from '../models/product-model';

interface DummyRecipe {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  mealType?: string[];
  image: string;
  rating?: number;
  cuisine?: string;
}

interface DummyRecipesResponse {
  recipes: DummyRecipe[];
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://dummyjson.com/recipes?limit=30';

  // Precios de demostración: deben reemplazarse por los precios reales del restaurante.
  private readonly preciosDemo = [16000, 18000, 20000, 22000, 24000, 26000];
  private productsRequest?: Observable<Product[]>;

  private readonly menuLocal: Product[] = [
    {
      id: 1,
      nombre: 'Pancakes clásicos',
      descripcion: 'Pancakes esponjosos acompañados de fruta fresca y sirope.',
      categoria: 'Desayunos',
      precio: 18000,
      imagen: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=900&q=85',
      ingredientes: ['Harina de trigo', 'Leche', 'Huevo', 'Mantequilla', 'Fruta fresca', 'Sirope'],
    },
    {
      id: 2,
      nombre: 'Waffles con fruta',
      descripcion: 'Waffles dorados servidos con fresas, banano y miel.',
      categoria: 'Desayunos',
      precio: 20000,
      imagen: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=900&q=85',
      ingredientes: ['Harina', 'Leche', 'Huevo', 'Fresas', 'Banano', 'Miel'],
    },
    {
      id: 3,
      nombre: 'Huevos benedictinos',
      descripcion: 'Huevos pochados sobre pan tostado con salsa holandesa.',
      categoria: 'Desayunos',
      precio: 24000,
      imagen: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=900&q=85',
      ingredientes: ['Huevo', 'Pan', 'Salsa holandesa', 'Jamón', 'Cebollín'],
    },
    {
      id: 4,
      nombre: 'Sándwich brunch',
      descripcion: 'Pan artesanal con huevo, queso, vegetales frescos y salsa de la casa.',
      categoria: 'Especiales',
      precio: 24000,
      imagen: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=900&q=85',
      ingredientes: ['Pan artesanal', 'Huevo', 'Queso', 'Tomate', 'Lechuga', 'Salsa de la casa'],
    },
    {
      id: 5,
      nombre: 'Bowl de frutas',
      descripcion: 'Mezcla fresca de frutas de temporada con yogur y granola.',
      categoria: 'Saludables',
      precio: 16000,
      imagen: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=900&q=85',
      ingredientes: ['Fresas', 'Banano', 'Papaya', 'Yogur', 'Granola'],
    },
    {
      id: 6,
      nombre: 'Tostadas francesas',
      descripcion: 'Pan dorado con canela, fruta fresca y un toque de miel.',
      categoria: 'Desayunos',
      precio: 19000,
      imagen: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=900&q=85',
      ingredientes: ['Pan', 'Leche', 'Huevo', 'Canela', 'Miel', 'Fruta'],
    },
  ];

  getProducts(forceRefresh = false): Observable<Product[]> {
    if (forceRefresh) this.productsRequest = undefined;
    if (!this.productsRequest) {
      this.productsRequest = this.http.get<DummyRecipesResponse>(this.apiUrl).pipe(
      timeout({ first: 10000 }),
      map((response) => {
        const recipes = (response.recipes ?? []).slice(0, 12);
        if (!recipes.length) return this.getLocalProducts();
        return recipes.map((recipe, index): Product => ({
          id: 1000 + recipe.id,
          nombre: recipe.name,
          descripcion: recipe.instructions?.[0] ?? 'Preparación especial de nuestra cocina.',
          categoria: this.getCategory(recipe),
          precio: this.preciosDemo[index % this.preciosDemo.length],
          imagen: recipe.image,
          ingredientes: recipe.ingredients ?? [],
          rating: recipe.rating,
        }));
      }),
      catchError((error) => {
        console.warn('No fue posible consultar la API. Se mostrará el menú local.', error);
        return of(this.getLocalProducts());
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
      );
    }
    return this.productsRequest;
  }

  private getCategory(recipe: DummyRecipe): string {
    const mealTypes = (recipe.mealType ?? []).join(' ').toLowerCase();
    if (mealTypes.includes('breakfast')) return 'Desayunos';
    if (mealTypes.includes('snack') || mealTypes.includes('side')) return 'Saludables';
    return 'Especiales';
  }

  getLocalProducts(): Product[] {
    return [...this.menuLocal];
  }
}
