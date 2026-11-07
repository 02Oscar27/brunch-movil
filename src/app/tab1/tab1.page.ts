import { Component } from '@angular/core';

import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton 
} from '@ionic/angular';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton, 
    RouterLink
  ],
})
export class Tab1Page {

  nombreRestaurante: string = 'Brunch Móvil';

  descripcion: string = 'Disfruta de nuestros desayunos, bebidas y platos especiales.'

  horario: string =  'Lunes a domingo, 8:00 a. m. - 4:00 p. m.';

  
}
