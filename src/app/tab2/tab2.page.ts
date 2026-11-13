import { Component, OnInit, inject } from '@angular/core';
import {IonBadge,IonButton,IonContent,IonHeader,IonGrid,IonRow,IonCol,IonToast,IonIcon,
  IonLabel,IonSearchbar,IonSegment,IonSegmentButton,IonSpinner,IonText,IonTitle,IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cartOutline, refreshOutline } from 'ionicons/icons';
import { RouterLink } from '@angular/router';
import { Product } from '../models/product-model';
import { CartService } from '../services/cart-service';
import { ProductService } from '../services/product-service';
import { ProductCardComponent } from '../components/product-card/cardcomponents';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
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
export class Tab2Page implements OnInit {
  private readonly productService = inject(ProductService);
  readonly cart = inject(CartService);
  products: Product[] = [];
  search = '';
  selectedCategory = 'Todos';
  loading = true;
  usingLocalMenu = false;
  toastOpen = false;
  toastMessage = '';
  readonly categories = ['Todos', 'Desayunos', 'Especiales', 'Saludables'];

  constructor() {
    addIcons({ cartOutline, refreshOutline });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(forceRefresh = false): void {
    this.loading = true;
    this.productService.getProducts(forceRefresh).subscribe({
      next: (products) => {
        this.products = products;
        this.usingLocalMenu = products.every((product) => product.id < 1000);
        this.loading = false;
      },
      error: () => {
        this.products = this.productService.getLocalProducts();
        this.usingLocalMenu = true;
        this.loading = false;
      },
    });
  }

  get filteredProducts(): Product[] {
    const term = this.search.trim().toLocaleLowerCase();
    return this.products.filter((product) => {
      const matchesCategory =
        this.selectedCategory === 'Todos' ||
        product.categoria.toLocaleLowerCase() === this.selectedCategory.toLocaleLowerCase();
      const matchesSearch =
        !term ||
        `${product.nombre} ${product.descripcion} ${product.ingredientes.join(' ')}`.toLocaleLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }

  onSearch(event: CustomEvent): void {
    this.search = String((event.detail as { value?: string }).value ?? '');
  }

  addToCart(product: Product): void {
    this.cart.add(product);
    this.toastMessage = `${product.nombre} se agregó al carrito`;
    this.toastOpen = true;
  }

  closeToast(): void {
    this.toastOpen = false;
  }
}
