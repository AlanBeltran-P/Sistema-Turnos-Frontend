import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    service = TestBed.inject(AuthService);
  });

  it('arranca sin sesión', () => {
    expect(service.estaLogueado()).toBe(false);
  });

  it('al hacer login devuelve un token y queda logueado', async () => {
    const respuesta = await firstValueFrom(service.login({ email: 'laura@demo.com', password: '12345678' }));
    expect(respuesta.token).toBeTruthy();
    expect(service.estaLogueado()).toBe(true);
  });

  it('al hacer logout se cierra la sesión', async () => {
    await firstValueFrom(service.login({ email: 'laura@demo.com', password: '12345678' }));
    service.logout();
    expect(service.estaLogueado()).toBe(false);
  });
});
