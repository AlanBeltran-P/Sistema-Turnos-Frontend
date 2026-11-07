import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { firstValueFrom } from 'rxjs';
import { ClienteAuthService } from '../../core/services/cliente-auth.service';
import { clickEnBoton, escribir, textoEnPantalla } from '../../shared/testing/pantalla';
import { Reserva } from './reserva';

const LUNES = '2030-01-07';

describe('Reserva', () => {
  let fixture: ComponentFixture<unknown>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'reservar/:slug', component: Reserva }])],
    });
  });

  async function abrirPantalla(slug: string): Promise<void> {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`/reservar/${slug}`);
    fixture = harness.fixture;
    await fixture.whenStable();
  }

  async function ingresarComoAna(): Promise<void> {
    await firstValueFrom(TestBed.inject(ClienteAuthService).login({ email: 'ana@demo.com', password: '12345678' }));
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

  it('muestra con qué profesional se reserva', async () => {
    await abrirPantalla('laura-gomez');
    expect(textoEnPantalla(fixture)).toContain('con Laura Gómez');
  });

  it('la confirmación trae el link para cancelar más adelante', async () => {
    await abrirPantalla('laura-gomez');
    await elegirCorteDelLunesALas9();
    await completarDatosYReservar();
    expect(fixture.nativeElement.querySelector('a[href^="/cancelar/"]')).toBeTruthy();
  });

  it('con la sesión de cliente abierta, los datos vienen cargados', async () => {
    await ingresarComoAna();
    await abrirPantalla('laura-gomez');
    await elegirCorteDelLunesALas9();
    const nombre = fixture.nativeElement.querySelector('input[name="nombre"]') as HTMLInputElement;
    expect(nombre.value).toBe('Ana López');
  });

  it('con la sesión de cliente abierta, la confirmación lleva a mis turnos', async () => {
    await ingresarComoAna();
    await abrirPantalla('laura-gomez');
    await elegirCorteDelLunesALas9();
    await clickEnBoton(fixture, 'Reservar turno');
    expect(fixture.nativeElement.querySelector('a[href="/cliente/turnos"]')).toBeTruthy();
  });

  it('permite cancelar el turno recién reservado', async () => {
    await abrirPantalla('laura-gomez');
    await elegirCorteDelLunesALas9();
    await completarDatosYReservar();
    await clickEnBoton(fixture, 'Cancelar turno');
    expect(textoEnPantalla(fixture)).toContain('Turno cancelado');
  });
});
