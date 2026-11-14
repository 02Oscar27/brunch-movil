import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonList,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonButton,
  IonToast,
  IonAlert
} from '@ionic/angular';

import type { Reserva } from '../models/reserva.model';
import { ReservasService } from '../services/reservas.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonDatetime,
    IonButton,
    IonToast,
    IonAlert,
    FormsModule
  ]
})
export class Tab3Page {

  private reservasService = inject(ReservasService);
  
  //Datos ingresados por el cliente
  nombre: string = '';
  telefono: string = '';
  personas: number | null = null;
  fechaHora: string = '';

  //Mensajes para el ususario
  mensaje: string = '';
  mostrarToast: boolean = false;

  //Confirmacion de la reserva
  mostrarConfirmacion: boolean = false;
  detalleReserva: string = '';

  botonesConfirmacion = [
    {
      text: 'Cancelar',
      role:'cancel'
    },
    {
      text: 'Confirmar',
      
      handler: async (): Promise<void>  => {
        
        if(this.personas === null){
          return;
        }

        const reserva: Reserva ={
        nombre: this.nombre.trim(),
        telefono: this.telefono.trim(),
        personas: this.personas,
        fechaHora: this.fechaHora
        };
        
        try {
          await this.reservasService.guardarReserva(reserva);
          this.mensaje ='Reserva guardada correctamente.';
        } catch {
          this.mensaje = 'No se pudo guardar la reserva.';
        }
        this.mostrarToast = true;
      }
    }
  ];
  //Fechas y horarios permitidos
  horasPermitidas: number[] = [
    8, 9, 10, 11, 12, 13, 14, 15
  ];

  minutosPermitidos: number[] = [
    0, 30
  ];

  //Validacion inicial del formulario
  validarReserva(): void {

    const nombreLimpio = this.nombre.trim();

    if(
      !nombreLimpio ||
      !this.telefono.trim() ||
      this.personas === null ||
      !this.fechaHora
    ) {
      this.mensaje = 'Todos los campos son obligatorios.';
      this.mostrarToast = true;
      return;
      }

    // Validar el nombre
    const patronNombre = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ ]+$/;

    if (
      nombreLimpio.length < 3 ||
      !patronNombre.test(nombreLimpio)
    ) {
      this.mensaje = 'Ingresa un nombre válido, solo letras.';
      this.mostrarToast = true;
      return;
    }

    // Validar el celular 
    const patronTelefono = /^3\d{9}$/;

    if (!patronTelefono.test(this.telefono.trim())) {
      this.mensaje ='Ingresa un celular válido de 10 dígitos que comience por 3 (Formato colombiano).';
      this.mostrarToast = true;
      return;
    }

    // Validar cantidad de personas
    if (this.personas < 1 || this.personas > 8) {
      this.mensaje = 'La reserva permite de 1 a 8 personas.';
      this.mostrarToast = true;
      return;
    }

    //Validar fecha futura
    const fechaSeleccionada = new Date(this.fechaHora);

    if(
      Number.isNaN(fechaSeleccionada.getTime()) ||
      fechaSeleccionada.getTime() <= Date.now()
    ) {
      this.mensaje = 'Selecciona una fecha y hora futura.';
      this.mostrarToast = true;
      return;
    }

    //Validar horario del restaurante
    const hora = fechaSeleccionada.getHours();
    const minuto = fechaSeleccionada.getMinutes();

    if (
      !this.horasPermitidas.includes(hora) ||
      !this.minutosPermitidos.includes(minuto)
    ) {
      this.mensaje = 'Reservas de 8:00 a. m. a 3:30 p. m., cada 30 minutos.';
      this.mostrarToast = true;
    return;
    }

    //Mostrar confirmacion
    this.detalleReserva = 
    `Nombre: ${nombreLimpio}\n` +
    `Celular: ${this.telefono}\n` +
    `Personas: ${this.personas}\n` +
    `Fecha y hora: ${this.fechaHora}`;

    this.mostrarConfirmacion = true;

  }

  async consultarReserva(): Promise<void> {
    try {
      const reserva = await this.reservasService.obtenerUltimaReserva();

      if(reserva === null){
        this.mensaje= 'No hay reservas guardadas.'
      } else {
        this.mensaje = `Última reserva: ${reserva.nombre}, ${reserva.personas} personas.`;
      }
    } catch {
        this.mensaje = 'No se pudo consultar la reserva.';
    } 

    this.mostrarToast = true;
  }
  
}
