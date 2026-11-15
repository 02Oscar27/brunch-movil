import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, shareReplay, timeout } from 'rxjs';
import { Category, Product } from '../models/product-model';

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

export type MenuSource = 'api' | 'local';

export interface MenuResult {
  products: Product[];
  source: MenuSource;
}

const API_URL = 'https://dummyjson.com/recipes?limit=30';
const REQUEST_TIMEOUT_MS = 10000;

// Precios de demostración: deben reemplazarse por los precios reales del restaurante.
const PRECIOS_DEMO: readonly number[] = [16000, 18000, 20000, 22000, 24000, 26000];

const MENU_LOCAL: readonly Product[] = [
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

/* ------------------------------------------------------------------ */
/* Diccionarios de traducción (se crean una sola vez, no en cada call) */
/* ------------------------------------------------------------------ */

const KNOWN_NAMES: Record<string, string> = {
  'tomato basil bruschetta': 'Bruschetta de tomate y albahaca',
  'chicken biryani': 'Biryani de pollo',
  'saag (spinach) with makki di roti': 'Espinacas con pan de maíz',
  'classic margherita pizza': 'Pizza margarita clásica',
  'vegetarian stir-fry': 'Salteado de verduras',
  'chocolate chip cookies': 'Galletas con chispas de chocolate',
  'greek salad': 'Ensalada griega',
  'chicken alfredo pasta': 'Pasta Alfredo con pollo',
  'mango salsa chicken': 'Pollo con salsa de mango',
  'quinoa salad': 'Ensalada de quinoa',
};

// Frases completas: se reemplazan antes que las palabras sueltas.
const PHRASES: Record<string, string> = {
  'all-purpose flour': 'harina de trigo',
  'olive oil': 'aceite de oliva',
  'extra virgin olive oil': 'aceite de oliva extra virgen',
  'black pepper': 'pimienta negra',
  'garlic powder': 'ajo en polvo',
  'green onions': 'cebolla larga',
  'green onion': 'cebolla larga',
  'bell pepper': 'pimentón',
  'bell peppers': 'pimentones',
  'cherry tomatoes': 'tomates cherry',
  'baking powder': 'polvo para hornear',
  'baking soda': 'bicarbonato de sodio',
  'soy sauce': 'salsa de soya',
  'tomato sauce': 'salsa de tomate',
  'heavy cream': 'crema de leche',
  'cream cheese': 'queso crema',
  'coconut milk': 'leche de coco',
  'brown sugar': 'azúcar morena',
  'parmesan cheese': 'queso parmesano',
  'bread crumbs': 'migas de pan',
  'chicken breast': 'pechuga de pollo',
  'fresh basil': 'albahaca fresca',
  'to taste': 'al gusto',
};

const WORDS: Record<string, string> = {
  // Ingredientes
  chicken: 'pollo', tomato: 'tomate', tomatoes: 'tomates', basil: 'albahaca',
  spinach: 'espinaca', onion: 'cebolla', onions: 'cebollas', garlic: 'ajo',
  salt: 'sal', pepper: 'pimienta', rice: 'arroz', flour: 'harina',
  butter: 'mantequilla', milk: 'leche', egg: 'huevo', eggs: 'huevos',
  cheese: 'queso', sugar: 'azúcar', water: 'agua', oil: 'aceite',
  potato: 'papa', potatoes: 'papas', carrot: 'zanahoria', carrots: 'zanahorias',
  cucumber: 'pepino', lettuce: 'lechuga', avocado: 'aguacate', lemon: 'limón',
  lime: 'lima', parsley: 'perejil', cilantro: 'cilantro', mushroom: 'champiñón',
  mushrooms: 'champiñones', beef: 'carne de res', pork: 'cerdo', shrimp: 'camarones',
  salmon: 'salmón', yogurt: 'yogur', honey: 'miel', oats: 'avena', oatmeal: 'avena',
  almond: 'almendra', almonds: 'almendras', bread: 'pan', banana: 'banano',
  bananas: 'bananos', strawberry: 'fresa', strawberries: 'fresas', apple: 'manzana',
  apples: 'manzanas', orange: 'naranja', oranges: 'naranjas', mango: 'mango',
  coconut: 'coco', pineapple: 'piña', corn: 'maíz', broccoli: 'brócoli',
  beans: 'fríjoles', peas: 'arvejas', lentils: 'lentejas', pasta: 'pasta',
  noodles: 'fideos', cinnamon: 'canela', vanilla: 'vainilla', chocolate: 'chocolate',
  cream: 'crema', turkey: 'pavo', ham: 'jamón', sausage: 'salchicha',
  mustard: 'mostaza', vinegar: 'vinagre', soy: 'soya', sauce: 'salsa',
  sesame: 'sésamo', ginger: 'jengibre', rosemary: 'romero', thyme: 'tomillo',
  mint: 'menta', olive: 'oliva', olives: 'aceitunas', cookies: 'galletas',
  cookie: 'galleta', pizza: 'pizza', burger: 'hamburguesa', sandwich: 'sándwich',
  pancakes: 'pancakes', waffle: 'waffle', waffles: 'waffles', fruit: 'fruta',

  // Preparación y adjetivos
  fresh: 'fresco', chopped: 'picado', diced: 'en cubos', sliced: 'en rodajas',
  ground: 'molido', shredded: 'rallado', grated: 'rallado', cooked: 'cocido',
  raw: 'crudo', dried: 'seco', frozen: 'congelado', roasted: 'asado',
  grilled: 'a la parrilla', creamy: 'cremoso', spicy: 'picante', classic: 'clásico',

  // Conectores
  with: 'con', and: 'y', or: 'o', for: 'para', soup: 'sopa', salad: 'ensalada',
  vegetable: 'vegetal', vegetables: 'verduras',
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Las frases más largas se aplican primero.
const PHRASE_RULES = Object.entries(PHRASES)
  .sort(([a], [b]) => b.length - a.length)
  .map(([phrase, replacement]) => ({
    regex: new RegExp(`\\b${escapeRegExp(phrase)}\\b`, 'g'),
    replacement,
  }));

function lookup(dictionary: Record<string, string>, key: string): string | undefined {
  return Object.prototype.hasOwnProperty.call(dictionary, key) ? dictionary[key] : undefined;
}

function capitalize(text: string): string {
  return text.charAt(0).toLocaleUpperCase('es') + text.slice(1);
}

/**
 * Traducción simple por diccionario. Limitación conocida: no reordena
 * palabras (ej.: "vegetable oil" queda "vegetal aceite"). Para un menú real
 * conviene tener los textos en español en tu propio JSON o backend.
 */
function translate(text: string): string {
  let result = text.trim().toLowerCase();

  for (const { regex, replacement } of PHRASE_RULES) {
    result = result.replace(regex, replacement);
  }

  result = result
    .split(/(\s+|[(),])/)
    .map((token) => lookup(WORDS, token) ?? token)
    .join('')
    .replace(/\s+/g, ' ')
    .trim();

  return capitalize(result);
}

function translateRecipeName(name: string): string {
  return lookup(KNOWN_NAMES, name.trim().toLowerCase()) ?? translate(name);
}

/* ------------------------------------------------------------------ */
/* Clasificación y descripciones                                       */
/* ------------------------------------------------------------------ */

// Clasificación conservadora: solo se usa el nombre de la receta, para que
// palabras sueltas de las instrucciones no clasifiquen mal los platos.
const BREAKFAST_NAMES = [
  'pancake', 'waffle', 'omelette', 'omelet', 'french toast',
  'scrambled egg', 'fried egg', 'poached egg', 'breakfast',
  'oatmeal', 'porridge', 'muffin', 'crepe', 'granola',
];

const HEALTHY_NAMES = [
  'salad', 'smoothie', 'fruit bowl', 'vegetable bowl',
  'quinoa', 'lentil', 'chickpea', 'tofu', 'avocado',
];

function getCategory(recipe: DummyRecipe): Category {
  const mealTypes = (recipe.mealType ?? []).map((value) => value.toLowerCase());
  const name = recipe.name.toLowerCase();

  if (mealTypes.includes('breakfast') || BREAKFAST_NAMES.some((word) => name.includes(word))) {
    return 'Desayunos';
  }

  if (
    mealTypes.includes('snack') ||
    mealTypes.includes('side') ||
    HEALTHY_NAMES.some((word) => name.includes(word))
  ) {
    return 'Saludables';
  }

  return 'Especiales';
}

function joinList(items: string[]): string {
  if (items.length <= 1) return items.join('');
  const last = items[items.length - 1];
  const conjunction = /^(i|hi(?!e))/i.test(last) ? 'e' : 'y';
  return `${items.slice(0, -1).join(', ')} ${conjunction} ${last}`;
}

function buildDescription(category: Category, ingredients: string[]): string {
  const intro: Record<Category, string> = {
    Desayunos: 'Una opción para empezar el día',
    Saludables: 'Una combinación fresca y equilibrada',
    Especiales: 'Una preparación especial de la casa',
  };

  const main = ingredients.slice(0, 3).map((ingredient) => ingredient.toLocaleLowerCase('es'));
  return main.length ? `${intro[category]} con ${joinList(main)}.` : `${intro[category]}.`;
}

/* ------------------------------------------------------------------ */
/* Servicio                                                            */
/* ------------------------------------------------------------------ */

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private menuRequest?: Observable<MenuResult>;

  /** Menú con información de su origen (API o respaldo local). */
  getMenu(forceRefresh = false): Observable<MenuResult> {
    if (forceRefresh || !this.menuRequest) {
      this.menuRequest = this.http.get<DummyRecipesResponse>(API_URL).pipe(
        timeout({ first: REQUEST_TIMEOUT_MS }),
        map((response): MenuResult => {
          const recipes = response.recipes ?? [];
          if (!recipes.length) return this.localMenu();
          return {
            source: 'api',
            products: recipes.map((recipe, index) => this.toProduct(recipe, index)),
          };
        }),
        catchError((error) => {
          console.warn('No fue posible consultar la API. Se mostrará el menú local.', error);
          return of(this.localMenu());
        }),
        shareReplay({ bufferSize: 1, refCount: false }),
      );
    }
    return this.menuRequest;
  }

  /** Solo la lista de productos (compatible con el código anterior). */
  getProducts(forceRefresh = false): Observable<Product[]> {
    return this.getMenu(forceRefresh).pipe(map((menu) => menu.products));
  }

  getLocalProducts(): Product[] {
    return [...MENU_LOCAL];
  }

  private localMenu(): MenuResult {
    return { source: 'local', products: this.getLocalProducts() };
  }

  private toProduct(recipe: DummyRecipe, index: number): Product {
    const categoria = getCategory(recipe);
    const ingredientes = (recipe.ingredients ?? []).map((ingredient) => translate(ingredient));

    return {
      id: 1000 + recipe.id,
      nombre: translateRecipeName(recipe.name),
      descripcion: buildDescription(categoria, ingredientes),
      categoria,
      precio: PRECIOS_DEMO[index % PRECIOS_DEMO.length] ?? 18000,
      imagen: recipe.image,
      ingredientes,
      rating: recipe.rating,
    };
  }
}
