import { TurnoResponse } from '../models/turno.model';
import { TurnoMock } from './datos-mock';

/** Lo que ve el cliente de un turno: sin los datos internos del mock. */
export function aTurnoResponse(turno: TurnoMock): TurnoResponse {
  return {
    publicId: turno.publicId,
    servicioNombre: turno.servicioNombre,
    fechaHoraInicio: turno.fechaHoraInicio,
    fechaHoraFin: turno.fechaHoraFin,
    estado: turno.estado,
    cancelacionToken: turno.cancelacionToken,
  };
}
