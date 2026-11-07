import { ComponentFixture, TestBed } from '@angular/core/testing';
import { clickEnBoton, escribir, textoEnPantalla } from '../../../shared/testing/pantalla';
import { Servicios } from './servicios';

describe('Servicios', () => {
  let fixture: ComponentFixture<Servicios>;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [Servicios] });
    fixture = TestBed.createComponent(Servicios);
    await fixture.whenStable();
  });

  it('lista los servicios del profesional', () => {
    expect(textoEnPantalla(fixture)).toContain('Corte de pelo');
    expect(textoEnPantalla(fixture)).toContain('Coloración');
  });

  it('agrega un servicio nuevo', async () => {
    await escribir(fixture, 'nombre', 'Peinado');
    await escribir(fixture, 'duracionMin', '60');
    await escribir(fixture, 'precio', '15000');
    await clickEnBoton(fixture, 'Agregar servicio');
    expect(textoEnPantalla(fixture)).toContain('Peinado');
  });

  it('edita un servicio existente', async () => {
    await clickEnBoton(fixture, 'Editar');
    expect(textoEnPantalla(fixture)).toContain('Editar servicio');
    await escribir(fixture, 'nombre', 'Corte clásico');
    await clickEnBoton(fixture, 'Guardar cambios');
    expect(textoEnPantalla(fixture)).toContain('Corte clásico');
    expect(textoEnPantalla(fixture)).not.toContain('Corte de pelo');
  });

  it('desactiva un servicio', async () => {
    await clickEnBoton(fixture, 'Desactivar');
    expect(textoEnPantalla(fixture)).toContain('Inactivo');
  });
});
