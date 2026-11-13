import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import {IonButton,IonCard,IonCardContent,IonCardHeader,IonCardSubtitle,IonCardTitle,
  IonIcon,IonImg,} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { Product } from '../../models/product-model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe,IonButton,IonCard,IonCardContent,IonCardHeader,IonCardSubtitle,
    IonCardTitle,IonIcon,IonImg,
  ],
  template: `
    <ion-card class="product-card">
      <div class="image-wrap"><ion-img [src]="product().imagen" [alt]="product().nombre"></ion-img></div>
      <ion-card-header>
        <ion-card-subtitle>{{ product().categoria }}</ion-card-subtitle>
        <ion-card-title>{{ product().nombre }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <p class="description">{{ product().descripcion }}</p>
        @if (product().ingredientes.length) {
          <p class="ingredients"><strong>Ingredientes:</strong> {{ product().ingredientes.slice(0, 5).join(', ') }}</p>
        }
        <div class="card-footer">
          <strong class="price">{{ product().precio | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</strong>
          <ion-button size="small" (click)="add.emit(product())" aria-label="Agregar {{ product().nombre }} al carrito">
            <ion-icon slot="start" name="add-outline"></ion-icon>Agregar
          </ion-button>
        </div>
      </ion-card-content>
    </ion-card>
  `,
  styles: [
    `
      .product-card {
        margin: 0;
        height: 100%;
        border-radius: 18px;
        overflow: hidden;
        box-shadow: 0 5px 18px #3d3a3214;
      }
      .image-wrap {
        height: 165px;
        overflow: hidden;
        background: #eee8dc;
      }
      ion-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      ion-card-header {
        padding: 13px 14px 5px;
      }
      ion-card-title {
        color: #3d3a32;
        font-size: 1.05rem;
        font-weight: 700;
      }
      ion-card-subtitle {
        color: #8a9a5b;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-size: 0.68rem;
      }
      ion-card-content {
        padding: 5px 14px 14px;
      }
      .description {
        color: #6d6a61;
        min-height: 42px;
        font-size: 0.83rem;
        line-height: 1.45;
      }
      .ingredients {
        color: #858176;
        font-size: 0.72rem;
        line-height: 1.4;
        min-height: 32px;
      }
      .card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-top: 10px;
      }
      .price {
        color: #a66a4c;
        font-size: 1rem;
        white-space: nowrap;
      }
      ion-button {
        --background: #8a9a5b;
        --border-radius: 10px;
        font-size: 0.75rem;
        margin: 0;
      }
    `,
  ],
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly add = output<Product>();
  constructor() {
    addIcons({ addOutline });
  }
}
