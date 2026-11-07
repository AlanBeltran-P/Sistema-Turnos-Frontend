import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Deja entrar al panel solo si hay sesión; si no, manda a /login. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  if (auth.estaLogueado()) {
    return true;
  }
  return inject(Router).createUrlTree(['/login']);
};
