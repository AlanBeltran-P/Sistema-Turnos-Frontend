import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TurnoMock } from '../mocks/datos-mock';
import { MockDb } from '../mocks/mock-db';
import { CambiarEstadoRequest, TurnoAgendaResponse } from '../models/turno.model';

/** Simula /api/turnos (agenda del profesional). */
@Injectable({ providedIn: 'root' })
export class TurnoService {
  private readonly db = inject(MockDb);

  /** desde y hasta en formato "yyyy-MM-dd", ambos incluidos. */
  verAgenda(desde: string, hasta: string): Observable<TurnoAgendaResponse[]> {
    const agenda = this.db.turnos
      .filter((turno) => estaEnRango(turno.fechaHoraInicio.slice(0, 10), desde, hasta))
      .sort((a, b) => a.fechaHoraInicio.localeCompare(b.fechaHoraInicio))
      .map(aTurnoAgenda);
    return of(agenda);
  }

  cambiarEstado(publicId: string, request: CambiarEstadoRequest): Observable<void> {
    this.db.turnos = this.db.turnos.map((turno) =>
      turno.publicId === publicId ? { ...turno, estado: request.nuevoEstado } : turno,
    );
    return of(undefined);
  }
}

function estaEnRango(fecha: string, desde: string, hasta: string): boolean {
  return fecha >= desde && fecha <= hasta;
}

function aTurnoAgenda(turno: TurnoMock): TurnoAgendaResponse {
  return {
    publicId: turno.publicId,
    servicioNombre: turno.servicioNombre,
    clienteNombre: turno.clienteNombre,
    clienteTelefono: turno.clienteTelefono,
    clienteEmail: turno.clienteEmail,
    fechaHoraInicio: turno.fechaHoraInicio,
    fechaHoraFin: turno.fechaHoraFin,
    estado: turno.estado,
  };
}
