import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { clickEnBoton, escribir, textoEnPantalla } from '../../shared/testing/pantalla';
import { Reserva } from './reserva';

const LUNES = '2030-01-07';

describe('Reserva', () => {
  let fixture: ComponentFixture<Reserva>;

  async function abrirPantalla(slug: string): Promise<void> {
    TestBed.configureTestingModule({
      imports: [Reserva],
      providers: [{ provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ slug }) } } }],
    });
    fixture = TestBed.createComponent(Reserva);
    await fixture.whenStable();
  }

  async function elegirCorteDelLunesALas9(): Promise<void> {
    await clickEnBoton(fixture, 'Corte de pelo');
    await escribir(fixture, 'fecha', LUNES);
    await clickEnBoton(fixture, '09:00');
  }

  async function completarDatosYReservar(): Promise<void> {
    await escribir(fixture, 'nombre', 'Ana López');
    await escribir(fixture, 'telefono', '11 1234-5678');
    await clickEnBoton(fixture, 'Reservar turno');
  }

  it('muestra los servicios del profesional', async () => {
    await abrirPantalla('laura-gomez');
    expect(textoEnPantalla(fixture)).toContain('Corte de pelo');
    expect(textoEnPantalla(fixture)).toContain('Coloración');
  });

  it('muestra un error si el profesional no existe', async () => {
    await abrirPantalla('no-existe');
    expect(textoEnPantalla(fixture)).toContain('Profesional no encontrado');
  });

  it('al elegir servicio y día muestra los horarios libres', async () => {
    await abrirPantalla('laura-gomez');
    await clickEnBoton(fixture, 'Corte de pelo');
    await escribir(fixture, 'fecha', LUNES);
    expect(textoEnPantalla(fixture)).toContain('09:00');
    expect(textoEnPantalla(fixture)).toContain('18:30');
  });

  it('reserva un turno y muestra el código de cancelación', async () => {
    await abrirPantalla('laura-gomez');
    await elegirCorteDelLunesALas9();
    await completarDatosYReservar();
    expect(textoEnPantalla(fixture)).toContain('¡Turno reservado!');
    expect(fixture.nativeElement.querySelector('code')?.textContent).toBeTruthy();
  });

  it('no deja reservar sin nombre ni teléfono', async () => {
    await abrirPantalla('laura-gomez');
    await elegirCorteDelLunesALas9();
    const botonReservar = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(botonReservar.disabled).toBe(true);
  });

  it('permite cancelar el turno recién reservado', async () => {
    await abrirPantalla('laura-gomez');
    await elegirCorteDelLunesALas9();
    await completarDatosYReservar();
    await clickEnBoton(fixture, 'Cancelar turno');
    expect(textoEnPantalla(fixture)).toContain('Turno cancelado');
  });
});
