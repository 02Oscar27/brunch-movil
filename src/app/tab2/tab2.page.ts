import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  IonBadge,
  IonButton,
  IonContent,
  IonHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonToast,
  IonIcon,
  IonLabel,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cartOutline, refreshOutline } from 'ionicons/icons';
import { RouterLink } from '@angular/router';
import { CATEGORIES, Category, Product, isCategory } from '../models/product-model';
import { CartService } from '../services/cart-service';
import { ProductService } from '../services/product-service';
import { ProductCardComponent } from '../components/product-card/cardcomponents';

type CategoryFilter = 'Todos' | Category;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    ProductCardComponent,
    IonBadge,
    IonButton,
    IonContent,
    IonHeader,
    IonGrid,
    IonRow,
    IonCol,
    IonToast,
    IonIcon,
    IonLabel,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonSpinner,
    IonText,
    IonTitle,
    IonToolbar,
  ],
})
export class Tab2Page {
  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);
  readonly cart = inject(CartService);

  readonly categories: readonly CategoryFilter[] = ['Todos', ...CATEGORIES];

  readonly products = signal<Product[]>([]);
  readonly search = signal('');
  readonly selectedCategory = signal<CategoryFilter>('Todos');
  readonly loading = signal(true);
  readonly usingLocalMenu = signal(false);
  readonly toastOpen = signal(false);
  readonly toastMessage = signal('');

  readonly filteredProducts = computed(() => {
    const term = this.search().trim().toLocaleLowerCase();
    const category = this.selectedCategory();

    return this.products().filter((product) => {
      const matchesCategory = category === 'Todos' || product.categoria === category;
      const matchesSearch =
        !term ||
        `${product.nombre} ${product.descripcion} ${product.ingredientes.join(' ')}`
          .toLocaleLowerCase()
          .includes(term);
      return matchesCategory && matchesSearch;
    });
  });

  constructor() {
    addIcons({ cartOutline, refreshOutline });
    this.loadProducts();
  }

  loadProducts(forceRefresh = false): void {
    this.loading.set(true);

    // getMenu() nunca falla: si la API no responde devuelve el menú local.
    this.productService
      .getMenu(forceRefresh)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((menu) => {
        this.products.set(menu.products);
        this.usingLocalMenu.set(menu.source === 'local');
        this.loading.set(false);
      });
  }

  onSearch(event: Event): void {
    const value = (event as CustomEvent<{ value?: string | null }>).detail?.value;
    this.search.set(value ?? '');
  }

  onCategoryChange(event: Event): void {
    const value = (event as CustomEvent<{ value?: string | number | null }>).detail?.value;
    this.selectedCategory.set(isCategory(value) ? value : 'Todos');
  }

  addToCart(product: Product): void {
    this.cart.add(product);
    this.toastMessage.set(`${product.nombre} se agregó al carrito`);
    this.toastOpen.set(true);
  }

  closeToast(): void {
    this.toastOpen.set(false);
  }
}
