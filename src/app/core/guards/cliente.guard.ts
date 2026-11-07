import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ClienteAuthService } from '../services/cliente-auth.service';

/** Deja entrar a "Mi cuenta" solo si el cliente ingresó; si no, manda a /cliente/ingresar. */
export const clienteGuard: CanActivateFn = () => {
  const clienteAuth = inject(ClienteAuthService);
  if (clienteAuth.estaLogueado()) {
    return true;
  }
  return inject(Router).createUrlTree(['/cliente/ingresar']);
};
