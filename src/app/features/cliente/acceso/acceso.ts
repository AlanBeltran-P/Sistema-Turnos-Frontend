import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClienteRegisterRequest } from '../../../core/models/cliente.model';
import { ClienteAuthService } from '../../../core/services/cliente-auth.service';

/** /cliente/ingresar: el cliente entra a su cuenta o crea una nueva. */
@Component({
  selector: 'app-acceso',
  imports: [FormsModule, RouterLink],
  templateUrl: './acceso.html',
  styleUrl: './acceso.css',
})
export class Acceso {
  private readonly clienteAuth = inject(ClienteAuthService);
  private readonly router = inject(Router);

  // Ingresar
  protected readonly email = signal('');
  protected readonly password = signal('');

  // Crear cuenta
  protected readonly nombre = signal('');
  protected readonly nuevoEmail = signal('');
  protected readonly telefono = signal('');
  protected readonly nuevaPassword = signal('');

  protected readonly error = signal<string | null>(null);

  ingresar(): void {
    this.clienteAuth.login({ email: this.email(), password: this.password() }).subscribe({
      next: () => this.irAMisTurnos(),
      error: (error: Error) => this.error.set(error.message),
    });
  }

  crearCuenta(): void {
    const request: ClienteRegisterRequest = {
      nombre: this.nombre(),
      email: this.nuevoEmail(),
      telefono: this.telefono(),
      password: this.nuevaPassword(),
    };
    this.clienteAuth.registrar(request).subscribe({
      next: () => this.irAMisTurnos(),
      error: (error: Error) => this.error.set(error.message),
    });
  }

  private irAMisTurnos(): void {
    this.router.navigate(['/cliente/turnos']);
  }
}
