import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { ClienteAuthService } from './cliente-auth.service';

const ANA = { email: 'ana@demo.com', password: '12345678' };
const NUEVO = { nombre: 'Pedro Gil', email: 'pedro@demo.com', telefono: '11 2222-3333', password: '12345678' };

describe('ClienteAuthService', () => {
  let service: ClienteAuthService;

  beforeEach(() => {
    service = TestBed.inject(ClienteAuthService);
  });

  it('arranca sin sesión', () => {
    expect(service.estaLogueado()).toBe(false);
  });

  it('ingresa con email y contraseña correctos', async () => {
    await firstValueFrom(service.login(ANA));
    expect(service.estaLogueado()).toBe(true);
    expect(service.cliente()?.nombre).toBe('Ana López');
  });

  it('no guarda la contraseña en la sesión', async () => {
    await firstValueFrom(service.login(ANA));
    expect(service.cliente()).not.toHaveProperty('password');
  });

  it('rechaza una contraseña incorrecta', async () => {
    await expect(firstValueFrom(service.login({ ...ANA, password: 'otra-cosa' }))).rejects.toThrow(
      'Email o contraseña incorrectos',
    );
  });

  it('registra un cliente nuevo y lo deja con la sesión abierta', async () => {
    await firstValueFrom(service.registrar(NUEVO));
    expect(service.cliente()?.email).toBe('pedro@demo.com');
  });

  it('no deja registrar dos veces el mismo email', async () => {
    await expect(firstValueFrom(service.registrar({ ...NUEVO, email: ANA.email }))).rejects.toThrow(
      'Ya existe una cuenta con ese email',
    );
  });

  it('al salir se cierra la sesión', async () => {
    await firstValueFrom(service.login(ANA));
    service.logout();
    expect(service.estaLogueado()).toBe(false);
  });
});
