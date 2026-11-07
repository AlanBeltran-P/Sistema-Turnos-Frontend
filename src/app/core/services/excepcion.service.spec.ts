import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { ExcepcionService } from './excepcion.service';

describe('ExcepcionService', () => {
  let service: ExcepcionService;

  beforeEach(() => {
    service = TestBed.inject(ExcepcionService);
  });

  it('crea una excepción y la agrega a la lista', async () => {
    const nueva = await firstValueFrom(
      service.crear({ fecha: '2030-01-07', horaInicio: null, horaFin: null, motivo: 'Vacaciones' }),
    );
    const lista = await firstValueFrom(service.listarPropias());
    expect(lista).toContainEqual(nueva);
  });

  it('elimina una excepción', async () => {
    await firstValueFrom(service.eliminar(1));
    const lista = await firstValueFrom(service.listarPropias());
    expect(lista.some((excepcion) => excepcion.id === 1)).toBe(false);
  });
});
