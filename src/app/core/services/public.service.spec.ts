import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { SERVICIOS_MOCK } from '../mocks/datos-mock';
import { MockDb } from '../mocks/mock-db';
import { ReservaRequest } from '../models/turno.model';
import { PublicService } from './public.service';

const SLUG = 'laura-gomez';
const LUNES = '2030-01-07';
const CORTE = SERVICIOS_MOCK[0]; // dura 30 minutos

function reservaDeCorte(hora: string): ReservaRequest {
  return {
    servicioPublicId: CORTE.publicId,
    fechaHoraInicio: `${LUNES}T${hora}`,
    clienteNombre: 'Ana López',
    clienteTelefono: '11 1234-5678',
    clienteEmail: null,
  };
}

describe('PublicService', () => {
  let service: PublicService;

  beforeEach(() => {
    service = TestBed.inject(PublicService);
  });

  async function horasLibresDelLunes(): Promise<string[]> {
    const slots = await firstValueFrom(service.consultarDisponibilidad(SLUG, CORTE.publicId, LUNES));
    return slots.map((slot) => slot.horaInicio);
  }

  it('devuelve los datos públicos del profesional', async () => {
    const profesional = await firstValueFrom(service.obtenerProfesional(SLUG));
    expect(profesional).toEqual({ nombre: 'Laura Gómez', slug: SLUG });
  });

  it('lista los servicios activos del profesional', async () => {
    const servicios = await firstValueFrom(service.listarServicios(SLUG));
    expect(servicios.length).toBe(3);
  });

  it('falla si el profesional no existe', async () => {
    await expect(firstValueFrom(service.listarServicios('no-existe'))).rejects.toThrow('Profesional no encontrado');
  });

  it('consulta los horarios libres de un día', async () => {
    const slots = await firstValueFrom(service.consultarDisponibilidad(SLUG, CORTE.publicId, LUNES));
    expect(slots[0]).toEqual({ horaInicio: '09:00', horaFin: '09:30' });
  });

  it('reserva un turno pendiente con token de cancelación', async () => {
    const turno = await firstValueFrom(service.reservar(SLUG, reservaDeCorte('09:00')));
    expect(turno.estado).toBe('PENDIENTE');
    expect(turno.fechaHoraFin).toBe(`${LUNES}T09:30`);
    expect(turno.cancelacionToken).toBeTruthy();
  });

  it('una reserva sin sesión no queda asociada a ningún cliente', async () => {
    const turno = await firstValueFrom(service.reservar(SLUG, reservaDeCorte('09:00')));
    const guardado = TestBed.inject(MockDb).turnos.find((t) => t.publicId === turno.publicId);
    expect(guardado?.clientePublicId).toBeNull();
  });

  it('un horario reservado deja de estar disponible', async () => {
    await firstValueFrom(service.reservar(SLUG, reservaDeCorte('09:00')));
    expect(await horasLibresDelLunes()).not.toContain('09:00');
  });

  it('no deja reservar dos veces el mismo horario', async () => {
    await firstValueFrom(service.reservar(SLUG, reservaDeCorte('09:00')));
    await expect(firstValueFrom(service.reservar(SLUG, reservaDeCorte('09:00')))).rejects.toThrow(
      'El horario ya no está disponible',
    );
  });

  it('al cancelar, el horario vuelve a estar libre', async () => {
    const turno = await firstValueFrom(service.reservar(SLUG, reservaDeCorte('09:00')));
    await firstValueFrom(service.cancelar(turno.cancelacionToken));
    expect(await horasLibresDelLunes()).toContain('09:00');
  });

  it('no deja cancelar dos veces el mismo turno', async () => {
    const turno = await firstValueFrom(service.reservar(SLUG, reservaDeCorte('09:00')));
    await firstValueFrom(service.cancelar(turno.cancelacionToken));
    await expect(firstValueFrom(service.cancelar(turno.cancelacionToken))).rejects.toThrow('El turno ya está cancelado');
  });
});
