import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ClienteAuthService } from '../../../core/services/cliente-auth.service';
import { SLUG_DEMO } from '../../../shared/demo';

@Component({
  selector: 'app-cliente-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './cliente-layout.html',
  styleUrl: '../../panel/panel-layout/panel-layout.css', // mismo diseño que el panel del profesional
})
export class ClienteLayout {
  private readonly clienteAuth = inject(ClienteAuthService);
  private readonly router = inject(Router);

  protected readonly cliente = this.clienteAuth.cliente;
  protected readonly slugDemo = SLUG_DEMO;

  salir(): void {
    this.clienteAuth.logout();
    this.router.navigate(['/']);
  }
}
