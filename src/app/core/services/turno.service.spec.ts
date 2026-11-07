import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { diaHabilEnDias } from '../../shared/utils/tiempo';
import { TurnoService } from './turno.service';

// Los turnos de ejemplo están armados contando días hábiles desde hoy.
const PRIMER_DIA_HABIL = diaHabilEnDias(0);
const SEGUNDO_DIA_HABIL = diaHabilEnDias(1);

describe('TurnoService', () => {
  let service: TurnoService;

  beforeEach(() => {
    service = TestBed.inject(TurnoService);
  });

  it('devuelve los turnos del día ordenados por hora', async () => {
    const agenda = await firstValueFrom(service.verAgenda(PRIMER_DIA_HABIL, PRIMER_DIA_HABIL));
    expect(agenda.map((turno) => turno.publicId)).toEqual(['t-01', 't-02']);
  });

  it('incluye los dos extremos del rango', async () => {
    const agenda = await firstValueFrom(service.verAgenda(PRIMER_DIA_HABIL, SEGUNDO_DIA_HABIL));
    expect(agenda.length).toBe(4);
  });

  it('no expone el token de cancelación en la agenda', async () => {
    const agenda = await firstValueFrom(service.verAgenda(PRIMER_DIA_HABIL, PRIMER_DIA_HABIL));
    expect(agenda[0]).not.toHaveProperty('cancelacionToken');
  });

  it('cambia el estado de un turno', async () => {
    await firstValueFrom(service.cambiarEstado('t-02', { nuevoEstado: 'COMPLETADO' }));
    const agenda = await firstValueFrom(service.verAgenda(PRIMER_DIA_HABIL, PRIMER_DIA_HABIL));
    expect(agenda.find((turno) => turno.publicId === 't-02')?.estado).toBe('COMPLETADO');
  });
});
