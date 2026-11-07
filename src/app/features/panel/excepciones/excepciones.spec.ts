import { ComponentFixture, TestBed } from '@angular/core/testing';
import { clickEnBoton, escribir, textoEnPantalla } from '../../../shared/testing/pantalla';
import { Excepciones } from './excepciones';

describe('Excepciones', () => {
  let fixture: ComponentFixture<Excepciones>;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [Excepciones] });
    fixture = TestBed.createComponent(Excepciones);
    await fixture.whenStable();
  });

  async function destildarTodoElDia(): Promise<void> {
    fixture.nativeElement.querySelector('input[name="todoElDia"]').click();
    await fixture.whenStable();
  }

  it('lista las excepciones cargadas', () => {
    expect(textoEnPantalla(fixture)).toContain('Trámite personal');
    expect(textoEnPantalla(fixture)).toContain('Feriado');
    expect(textoEnPantalla(fixture)).toContain('Todo el día');
  });

  it('agrega una excepción de día completo', async () => {
    await escribir(fixture, 'fecha', '2030-01-07');
    await escribir(fixture, 'motivo', 'Vacaciones');
    await clickEnBoton(fixture, 'Agregar excepción');
    expect(textoEnPantalla(fixture)).toContain('Vacaciones');
  });

  it('agrega una excepción de algunas horas', async () => {
    await escribir(fixture, 'fecha', '2030-01-07');
    await destildarTodoElDia();
    await escribir(fixture, 'horaInicio', '10:00');
    await escribir(fixture, 'horaFin', '12:00');
    await clickEnBoton(fixture, 'Agregar excepción');
    expect(textoEnPantalla(fixture)).toContain('10:00 a 12:00');
  });

  it('elimina una excepción', async () => {
    await clickEnBoton(fixture, 'Eliminar');
    expect(textoEnPantalla(fixture)).not.toContain('Trámite personal');
  });
});
