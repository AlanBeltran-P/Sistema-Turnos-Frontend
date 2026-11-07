import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';

function ejecutarGuard() {
  return TestBed.runInInjectionContext(() =>
    authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
  );
}

describe('authGuard', () => {
  it('sin sesión redirige a /login', () => {
    const resultado = ejecutarGuard() as UrlTree;
    expect(TestBed.inject(Router).serializeUrl(resultado)).toBe('/login');
  });

  it('con sesión deja pasar', async () => {
    await firstValueFrom(TestBed.inject(AuthService).login({ email: 'laura@demo.com', password: '12345678' }));
    expect(ejecutarGuard()).toBe(true);
  });
});
