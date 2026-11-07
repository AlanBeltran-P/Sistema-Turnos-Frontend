import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { aHora, aMinutos } from '../../shared/utils/tiempo';
import { calcularSlots } from '../mocks/calculadora-slots';
import { TurnoMock } from '../mocks/datos-mock';
import { MockDb } from '../mocks/mock-db';
import { SlotDisponibleResponse } from '../models/disponibilidad.model';
import { ProfesionalPublicoResponse } from '../models/profesional.model';
import { ServicioResponse } from '../models/servicio.model';
import { ReservaRequest, TurnoResponse } from '../models/turno.model';

/** Simula /api/public (reserva sin login). */
@Injectable({ providedIn: 'root' })
export class PublicService {
  private readonly db = inject(MockDb);

  /** No existe en el back: habría que agregar GET /api/public/profesionales/{slug}. */
  obtenerProfesional(slug: string): Observable<ProfesionalPublicoResponse> {
    if (!this.existeProfesional(slug)) {
      return error('Profesional no encontrado');
    }
    return of({ nombre: this.db.profesional.nombre, slug });
  }

  listarServicios(slug: string): Observable<ServicioResponse[]> {
    if (!this.existeProfesional(slug)) {
      return error('Profesional no encontrado');
    }
    return of(this.db.servicios.filter((servicio) => servicio.activo));
  }

  consultarDisponibilidad(slug: string, servicioId: string, fecha: string): Observable<SlotDisponibleResponse[]> {
    const servicio = this.buscarServicio(servicioId);
    if (!this.existeProfesional(slug) || !servicio) {
      return error('Profesional o servicio no encontrado');
    }
    return of(calcularSlots(this.db, fecha, servicio.duracionMin));
  }

  reservar(slug: string, request: ReservaRequest): Observable<TurnoResponse> {
    const servicio = this.buscarServicio(request.servicioPublicId);
    if (!this.existeProfesional(slug) || !servicio) {
      return error('Profesional o servicio no encontrado');
    }
    const [fecha, hora] = request.fechaHoraInicio.split('T');
    const slots = calcularSlots(this.db, fecha, servicio.duracionMin);
    if (!slots.some((slot) => slot.horaInicio === hora)) {
      return error('El horario ya no está disponible');
    }
    const turno = crearTurno(request, servicio);
    this.db.turnos = [...this.db.turnos, turno];
    return of(aTurnoResponse(turno));
  }

  cancelar(cancelacionToken: string): Observable<void> {
    const turno = this.db.turnos.find((t) => t.cancelacionToken === cancelacionToken);
    if (!turno) {
      return error('Turno no encontrado');
    }
    if (turno.estado === 'CANCELADO') {
      return error('El turno ya está cancelado');
    }
    this.db.turnos = this.db.turnos.map((t) => (t === turno ? { ...t, estado: 'CANCELADO' } : t));
    return of(undefined);
  }

  private existeProfesional(slug: string): boolean {
    return this.db.profesional.slug === slug;
  }

  private buscarServicio(publicId: string): ServicioResponse | undefined {
    return this.db.servicios.find((servicio) => servicio.publicId === publicId && servicio.activo);
  }
}

function error(mensaje: string): Observable<never> {
  return throwError(() => new Error(mensaje));
}

function crearTurno(request: ReservaRequest, servicio: ServicioResponse): TurnoMock {
  const [fecha, hora] = request.fechaHoraInicio.split('T');
  return {
    publicId: crypto.randomUUID(),
    servicioPublicId: servicio.publicId,
    servicioNombre: servicio.nombre,
    clienteNombre: request.clienteNombre,
    clienteTelefono: request.clienteTelefono,
    clienteEmail: request.clienteEmail,
    fechaHoraInicio: request.fechaHoraInicio,
    fechaHoraFin: `${fecha}T${aHora(aMinutos(hora) + servicio.duracionMin)}`,
    estado: 'PENDIENTE',
    cancelacionToken: crypto.randomUUID(),
  };
}

function aTurnoResponse(turno: TurnoMock): TurnoResponse {
  return {
    publicId: turno.publicId,
    servicioNombre: turno.servicioNombre,
    fechaHoraInicio: turno.fechaHoraInicio,
    fechaHoraFin: turno.fechaHoraFin,
    estado: turno.estado,
    cancelacionToken: turno.cancelacionToken,
  };
}
