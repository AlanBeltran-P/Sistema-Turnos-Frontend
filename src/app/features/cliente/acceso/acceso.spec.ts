import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { ClienteAuthService } from '../../../core/services/cliente-auth.service';
import { clickEnBoton, escribir, textoEnPantalla } from '../../../shared/testing/pantalla';
import { Acceso } from './acceso';

describe('Acceso', () => {
  let fixture: ComponentFixture<Acceso>;
  let router: Router;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [Acceso], providers: [provideRouter([])] });
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(Acceso);
    await fixture.whenStable();
  });

  it('ingresa con la cuenta demo y va a mis turnos', async () => {
    await escribir(fixture, 'email', 'ana@demo.com');
    await escribir(fixture, 'password', '12345678');
    await clickEnBoton(fixture, 'Ingresar');
    expect(TestBed.inject(ClienteAuthService).estaLogueado()).toBe(true);
    expect(router.navigate).toHaveBeenCalledWith(['/cliente/turnos']);
  });

  it('muestra un error si la contraseña es incorrecta', async () => {
    await escribir(fixture, 'email', 'ana@demo.com');
    await escribir(fixture, 'password', 'otra-cosa');
    await clickEnBoton(fixture, 'Ingresar');
    expect(textoEnPantalla(fixture)).toContain('Email o contraseña incorrectos');
  });

  it('crea una cuenta nueva y va a mis turnos', async () => {
    await escribir(fixture, 'nombre', 'Pedro Gil');
    await escribir(fixture, 'nuevoEmail', 'pedro@demo.com');
    await escribir(fixture, 'telefono', '11 2222-3333');
    await escribir(fixture, 'nuevaPassword', '12345678');
    await clickEnBoton(fixture, 'Crear cuenta');
    expect(TestBed.inject(ClienteAuthService).cliente()?.nombre).toBe('Pedro Gil');
    expect(router.navigate).toHaveBeenCalledWith(['/cliente/turnos']);
  });
});
