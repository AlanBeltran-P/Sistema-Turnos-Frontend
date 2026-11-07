import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ClienteAuthService } from '../services/cliente-auth.service';
import { clienteGuard } from './cliente.guard';

function ejecutarGuard() {
  return TestBed.runInInjectionContext(() =>
    clienteGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
  );
}

describe('clienteGuard', () => {
  it('sin sesión redirige a /cliente/ingresar', () => {
    const resultado = ejecutarGuard() as UrlTree;
    expect(TestBed.inject(Router).serializeUrl(resultado)).toBe('/cliente/ingresar');
  });

  it('con sesión deja pasar', async () => {
    await firstValueFrom(TestBed.inject(ClienteAuthService).login({ email: 'ana@demo.com', password: '12345678' }));
    expect(ejecutarGuard()).toBe(true);
  });
});
