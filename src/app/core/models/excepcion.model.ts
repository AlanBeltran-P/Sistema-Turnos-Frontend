/** fecha en formato "yyyy-MM-dd". Sin horaInicio/horaFin se bloquea el día completo. */
export interface ExcepcionResponse {
  id: number;
  fecha: string;
  horaInicio: string | null;
  horaFin: string | null;
  motivo: string | null;
}

export interface ExcepcionRequest {
  fecha: string;
  horaInicio: string | null;
  horaFin: string | null;
  motivo: string | null;
}
