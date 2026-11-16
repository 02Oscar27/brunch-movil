
import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';

import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonImg
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';

import type { Product } from '../../models/product-model';

@Component({
  selector: 'app-product-card',
  standalone: true,

  imports: [
    CurrencyPipe,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonIcon,
    IonImg
  ],

  templateUrl: './cardcomponents.html',
  styleUrl: './cardcomponents.scss'
})
export class ProductCardComponent {

  readonly product = input.required<Product>();

  readonly add = output<Product>();

  constructor() {
    addIcons({ addOutline });
  }
}
