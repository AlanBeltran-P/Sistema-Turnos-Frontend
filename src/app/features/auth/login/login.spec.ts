import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { AuthService } from '../../../core/services/auth.service';
import { clickEnBoton, escribir } from '../../../shared/testing/pantalla';
import { Login } from './login';

describe('Login', () => {
  let fixture: ComponentFixture<Login>;
  let router: Router;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [Login], providers: [provideRouter([])] });
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(Login);
    await fixture.whenStable();
  });

  function botonIngresar(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button[type="submit"]');
  }

  it('el botón está deshabilitado hasta completar los datos', () => {
    expect(botonIngresar().disabled).toBe(true);
  });

  it('no acepta contraseñas de menos de 8 caracteres', async () => {
    await escribir(fixture, 'email', 'laura@demo.com');
    await escribir(fixture, 'password', '1234');
    expect(botonIngresar().disabled).toBe(true);
  });

  it('al ingresar inicia sesión y va al panel', async () => {
    await escribir(fixture, 'email', 'laura@demo.com');
    await escribir(fixture, 'password', '12345678');
    await clickEnBoton(fixture, 'Ingresar');
    expect(TestBed.inject(AuthService).estaLogueado()).toBe(true);
    expect(router.navigate).toHaveBeenCalledWith(['/panel']);
  });
});
