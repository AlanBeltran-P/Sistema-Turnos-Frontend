import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { fechaEnDias } from '../../shared/utils/tiempo';
import { TurnoService } from './turno.service';

// Los turnos de ejemplo están armados a partir de la fecha de hoy.
const HOY = fechaEnDias(0);
const MANIANA = fechaEnDias(1);

describe('TurnoService', () => {
  let service: TurnoService;

  beforeEach(() => {
    service = TestBed.inject(TurnoService);
  });

  it('devuelve los turnos del día ordenados por hora', async () => {
    const agenda = await firstValueFrom(service.verAgenda(HOY, HOY));
    expect(agenda.map((turno) => turno.publicId)).toEqual(['t-01', 't-02']);
  });

  it('incluye los dos extremos del rango', async () => {
    const agenda = await firstValueFrom(service.verAgenda(HOY, MANIANA));
    expect(agenda.length).toBe(4);
  });

  it('no expone el token de cancelación en la agenda', async () => {
    const agenda = await firstValueFrom(service.verAgenda(HOY, HOY));
    expect(agenda[0]).not.toHaveProperty('cancelacionToken');
  });

  it('cambia el estado de un turno', async () => {
    await firstValueFrom(service.cambiarEstado('t-02', { nuevoEstado: 'COMPLETADO' }));
    const agenda = await firstValueFrom(service.verAgenda(HOY, HOY));
    expect(agenda.find((turno) => turno.publicId === 't-02')?.estado).toBe('COMPLETADO');
  });
});
