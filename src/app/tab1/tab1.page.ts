import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
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

  private cdr = inject(ChangeDetectorRef);

  nombreRestaurante: string = 'Brunch Móvil';

  descripcion: string = 'Disfruta de nuestros desayunos, bebidas y platos especiales.'

  horario: string =  'Lunes a domingo, 8:00 a. m. - 3:30 p. m.';

  //Datos de geolocalizacion
  latitud: number | null = null;
  longitud: number | null = null;
  precision: number | null = null;
  mensajeUbicacion: string = '';

  cargandoUbicacion: boolean = false;

  //Obtener la ubicacion del dispositivos
  async obtenerUbicacion(): Promise<void> {

    if (this.cargandoUbicacion){
      return;
    }

    this.cargandoUbicacion = true;
    this.mensajeUbicacion = '';

    try {
      //Solicitar permisos si estamos en adnroid
      if(Capacitor.isNativePlatform()){

        const permisos = await Geolocation.requestPermissions();

        if(
          permisos.location !== 'granted'  &&
          permisos.coarseLocation !== 'granted'
        ){
          this.mensajeUbicacion = 'No se autorizó el acceso a la ubicación.';
          return;
        }
      }
      //Obtener las coordenadas
      const posicion = await Geolocation.getCurrentPosition({
        timeout: 20000
      });

      this.latitud = posicion.coords.latitude;
      this.longitud = posicion.coords.longitude;
      this.precision = posicion.coords.accuracy;

      this.mensajeUbicacion = 'Ubicación obtenida correctamente.';
    } catch {
      this.mensajeUbicacion = 'No se pudo obtener la ubicación. Revisa los permisos y el GPS.';
    }

    finally {
      this.cargandoUbicacion = false;
      this.cdr.detectChanges();
    }
  }

}
