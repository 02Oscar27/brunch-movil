
import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  IonAlert,
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonThumbnail,
  IonTitle,
  IonToast,
  IonToolbar
} from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  addOutline,
  arrowBackOutline,
  checkmarkCircleOutline,
  removeOutline,
  trashOutline
} from 'ionicons/icons';

import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart-page.html',
  styleUrls: ['./cart-page.scss'],

  imports: [
    CurrencyPipe,
    RouterLink,
    IonAlert,
    IonBadge,
    IonButton,
    IonCard,
    IonCardContent,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonThumbnail,
    IonTitle,
    IonToast,
    IonToolbar
  ]
})
export class CartPage {

  readonly cart = inject(CartService);

  toastOpen = false;
  toastMessage = '';
  clearAlertOpen = false;

  readonly clearAlertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel'
    },
    {
      text: 'Sí, vaciar',
      role: 'destructive',
      handler: (): void => {
        this.cart.clear();
        this.showToast('Se vació el carrito');
      }
    }
  ];

  constructor() {
    addIcons({
      addOutline,
      arrowBackOutline,
      checkmarkCircleOutline,
      removeOutline,
      trashOutline
    });
  }

  removeProduct(productId: number, productName: string): void {
    this.cart.remove(productId);
    this.showToast(`${productName} se eliminó del carrito`);
  }

  confirmClearCart(): void {
    this.clearAlertOpen = true;
  }

  completePurchase(): void {
    if (this.cart.items().length === 0) return;

    this.cart.clear();
    this.showToast('Compra realizada exitosamente');
  }

  private showToast(message: string): void {
    this.toastMessage = message;
    this.toastOpen = true;
  }
}
