import { ComponentFixture, TestBed } from '@angular/core/testing';
import { clickEnBoton, escribir, textoEnPantalla } from '../../../shared/testing/pantalla';
import { diaHabilEnDias, fechaEnDias } from '../../../shared/utils/tiempo';
import { Agenda } from './agenda';

describe('Agenda', () => {
  let fixture: ComponentFixture<Agenda>;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [Agenda] });
    fixture = TestBed.createComponent(Agenda);
    await fixture.whenStable();
  });

  async function filtrar(desde: string, hasta: string): Promise<void> {
    await escribir(fixture, 'desde', desde);
    await escribir(fixture, 'hasta', hasta);
    await clickEnBoton(fixture, 'Buscar');
  }

  function cantidadConEstado(estado: string): number {
    return fixture.nativeElement.querySelectorAll(`[data-estado="${estado}"]`).length;
  }

  it('arranca mostrando los turnos de los próximos días', () => {
    expect(textoEnPantalla(fixture)).toContain('Martín Pérez');
    expect(textoEnPantalla(fixture)).toContain('Camila Ruiz');
  });

  it('filtra por rango de fechas', async () => {
    await filtrar(diaHabilEnDias(1), diaHabilEnDias(1));
    expect(textoEnPantalla(fixture)).toContain('Juan Torres');
    expect(textoEnPantalla(fixture)).not.toContain('Martín Pérez');
  });

  it('avisa cuando no hay turnos', async () => {
    await filtrar(fechaEnDias(30), fechaEnDias(31));
    expect(textoEnPantalla(fixture)).toContain('No hay turnos en estas fechas');
  });

  it('marca un turno como completado', async () => {
    // El primer día hábil hay un turno completado y uno confirmado (el único con botones).
    await filtrar(diaHabilEnDias(0), diaHabilEnDias(0));
    await clickEnBoton(fixture, 'Completado');
    expect(cantidadConEstado('COMPLETADO')).toBe(2);
  });
});
