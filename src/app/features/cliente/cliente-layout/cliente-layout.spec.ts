import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { vi } from 'vitest';
import { ClienteAuthService } from '../../../core/services/cliente-auth.service';
import { clickEnBoton, textoEnPantalla } from '../../../shared/testing/pantalla';
import { ClienteLayout } from './cliente-layout';

describe('ClienteLayout', () => {
  let fixture: ComponentFixture<ClienteLayout>;
  let router: Router;
  let clienteAuth: ClienteAuthService;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [ClienteLayout], providers: [provideRouter([])] });
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    clienteAuth = TestBed.inject(ClienteAuthService);
    await firstValueFrom(clienteAuth.login({ email: 'ana@demo.com', password: '12345678' }));
    fixture = TestBed.createComponent(ClienteLayout);
    await fixture.whenStable();
  });

  it('muestra el nombre del cliente', () => {
    expect(textoEnPantalla(fixture)).toContain('Ana López');
  });

  it('tiene los links a mis turnos y a reservar', () => {
    expect(fixture.nativeElement.querySelector('a[href="/turnos"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('a[href="/reservar/laura-gomez"]')).toBeTruthy();
  });

  it('al salir cierra la sesión y vuelve al inicio', async () => {
    await clickEnBoton(fixture, 'Salir');
    expect(clienteAuth.estaLogueado()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
