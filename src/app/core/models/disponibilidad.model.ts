/** Horas en formato "HH:mm". diaSemana: 0 = domingo ... 6 = sábado. */
export interface DisponibilidadResponse {
  id: number;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
}

export interface DisponibilidadRequest {
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
}

export interface SlotDisponibleResponse {
  horaInicio: string;
  horaFin: string;
}
