import { ComponentFixture, TestBed } from '@angular/core/testing';
import { clickEnBoton, escribir, textoEnPantalla } from '../../../shared/testing/pantalla';
import { Disponibilidad } from './disponibilidad';

describe('Disponibilidad', () => {
  let fixture: ComponentFixture<Disponibilidad>;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [Disponibilidad] });
    fixture = TestBed.createComponent(Disponibilidad);
    await fixture.whenStable();
  });

  function cantidadDeFilas(): number {
    return fixture.nativeElement.querySelectorAll('tbody tr').length;
  }

  it('lista los horarios con el nombre del día', () => {
    expect(textoEnPantalla(fixture)).toContain('Lunes');
    expect(textoEnPantalla(fixture)).toContain('Sábado');
  });

  it('agrega un horario nuevo', async () => {
    await escribir(fixture, 'horaInicio', '20:00');
    await escribir(fixture, 'horaFin', '22:00');
    await clickEnBoton(fixture, 'Agregar horario');
    expect(textoEnPantalla(fixture)).toContain('22:00');
  });

  it('no deja guardar si la hora de fin es anterior a la de inicio', async () => {
    await escribir(fixture, 'horaInicio', '14:00');
    await escribir(fixture, 'horaFin', '10:00');
    const botonGuardar = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(botonGuardar.disabled).toBe(true);
    expect(textoEnPantalla(fixture)).toContain('La hora de fin tiene que ser posterior');
  });

  it('elimina un horario', async () => {
    const filasAntes = cantidadDeFilas();
    await clickEnBoton(fixture, 'Eliminar');
    expect(cantidadDeFilas()).toBe(filasAntes - 1);
  });
});
