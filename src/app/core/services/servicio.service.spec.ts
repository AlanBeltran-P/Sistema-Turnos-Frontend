import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { SERVICIOS_MOCK } from '../mocks/datos-mock';
import { ServicioService } from './servicio.service';

const CORTE = SERVICIOS_MOCK[0];

describe('ServicioService', () => {
  let service: ServicioService;

  beforeEach(() => {
    service = TestBed.inject(ServicioService);
  });

  it('crea un servicio activo y lo agrega a la lista', async () => {
    const nuevo = await firstValueFrom(service.crear({ nombre: 'Peinado', duracionMin: 60, precio: 15000 }));
    const servicios = await firstValueFrom(service.listarPropios());
    expect(nuevo.activo).toBe(true);
    expect(servicios).toContainEqual(nuevo);
  });

  it('actualiza nombre, duración y precio', async () => {
    const cambios = { nombre: 'Corte clásico', duracionMin: 40, precio: 9000 };
    const actualizado = await firstValueFrom(service.actualizar(CORTE.publicId, cambios));
    expect(actualizado).toEqual({ ...CORTE, ...cambios });
  });

  it('desactivar no borra el servicio, lo marca como inactivo', async () => {
    await firstValueFrom(service.desactivar(CORTE.publicId));
    const servicios = await firstValueFrom(service.listarPropios());
    const corte = servicios.find((servicio) => servicio.publicId === CORTE.publicId);
    expect(corte?.activo).toBe(false);
  });
});
