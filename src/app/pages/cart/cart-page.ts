import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
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
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline, arrowBackOutline, removeOutline, trashOutline } from 'ionicons/icons';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart-page.html',
  styleUrls: ['./cart-page.scss'],
  imports: [
    CurrencyPipe,
    RouterLink,
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
    IonToolbar,
  ],
})
export class CartPage {
  readonly cart = inject(CartService);
  constructor() {
    addIcons({ addOutline, arrowBackOutline, removeOutline, trashOutline });
  }
}
