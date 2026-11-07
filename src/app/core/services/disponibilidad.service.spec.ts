import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { DisponibilidadService } from './disponibilidad.service';

describe('DisponibilidadService', () => {
  let service: DisponibilidadService;

  beforeEach(() => {
    service = TestBed.inject(DisponibilidadService);
  });

  it('crea una disponibilidad y la agrega a la lista', async () => {
    const nueva = await firstValueFrom(service.crear({ diaSemana: 0, horaInicio: '10:00', horaFin: '12:00' }));
    const lista = await firstValueFrom(service.listarPropias());
    expect(lista).toContainEqual(nueva);
  });

  it('actualiza el horario de una disponibilidad', async () => {
    await firstValueFrom(service.actualizar(1, { diaSemana: 1, horaInicio: '08:00', horaFin: '12:00' }));
    const lista = await firstValueFrom(service.listarPropias());
    expect(lista.find((disponibilidad) => disponibilidad.id === 1)?.horaInicio).toBe('08:00');
  });

  it('elimina una disponibilidad', async () => {
    await firstValueFrom(service.eliminar(1));
    const lista = await firstValueFrom(service.listarPropias());
    expect(lista.some((disponibilidad) => disponibilidad.id === 1)).toBe(false);
  });
});
