import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { homeOutline, restaurantOutline, calendarOutline, cartOutline } from 'ionicons/icons';

import { CartService } from '../services/cart-service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);
  readonly cart = inject(CartService);

  constructor() {
    addIcons({
      homeOutline,
      restaurantOutline,
      calendarOutline,
      cartOutline,
    });
  }
}
