export type EstadoTurno = 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO' | 'COMPLETADO' | 'AUSENTE';

export const ETIQUETAS_ESTADO: Record<EstadoTurno, string> = {
  PENDIENTE: 'Pendiente',
  CONFIRMADO: 'Confirmado',
  CANCELADO: 'Cancelado',
  COMPLETADO: 'Completado',
  AUSENTE: 'Ausente',
};

/** Fechas con hora en formato "yyyy-MM-ddTHH:mm". */
export interface ReservaRequest {
  servicioPublicId: string;
  fechaHoraInicio: string;
  clienteNombre: string;
  clienteTelefono: string;
  clienteEmail: string | null;
}

export interface TurnoResponse {
  publicId: string;
  servicioNombre: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  estado: EstadoTurno;
  cancelacionToken: string;
}

export interface TurnoAgendaResponse {
  publicId: string;
  servicioNombre: string;
  clienteNombre: string;
  clienteTelefono: string;
  clienteEmail: string | null;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  estado: EstadoTurno;
}

export interface CambiarEstadoRequest {
  nuevoEstado: EstadoTurno;
}
