import { Injectable } from "@angular/core";
import { Preferences } from '@capacitor/preferences';

import type { Reserva } from "../models/reserva.model";

@Injectable({
    providedIn: 'root'
})

export class ReservasService {

    async guardarReserva(reserva: Reserva): Promise<void>{

        await Preferences.set({
            key: 'ultimaReserva',
            value: JSON.stringify(reserva)
        });
    }

    //Obtener la ultima reserva guardada
    async obtenerUltimaReserva(): Promise<Reserva | null> {

        const resultado = await Preferences.get({
            key: 'ultimaReserva'
        });

        if (resultado.value === null) {
            return null;
        }

        return JSON.parse(resultado.value) as Reserva;
        }

}