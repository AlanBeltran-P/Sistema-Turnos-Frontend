import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { ClienteMock } from '../mocks/datos-mock';
import { MockDb } from '../mocks/mock-db';
import { ClienteRegisterRequest, ClienteResponse } from '../models/cliente.model';
import { AuthRequest } from '../models/profesional.model';

/**
 * Sesión del cliente. No existe en el back: hace falta login con rol CLIENTE
 * y endpoints tipo /api/cliente/auth/login y /api/cliente/auth/register.
 */
@Injectable({ providedIn: 'root' })
export class ClienteAuthService {
  private readonly db = inject(MockDb);
  private readonly clienteActual = signal<ClienteResponse | null>(null);

  readonly cliente = this.clienteActual.asReadonly();
  readonly estaLogueado = computed(() => this.clienteActual() !== null);

  login(request: AuthRequest): Observable<ClienteResponse> {
    const cliente = this.db.clientes.find((c) => c.email === request.email && c.password === request.password);
    if (!cliente) {
      return throwError(() => new Error('Email o contraseña incorrectos'));
    }
    return of(this.iniciarSesion(cliente));
  }

  registrar(request: ClienteRegisterRequest): Observable<ClienteResponse> {
    if (this.db.clientes.some((c) => c.email === request.email)) {
      return throwError(() => new Error('Ya existe una cuenta con ese email'));
    }
    const nuevo: ClienteMock = { publicId: crypto.randomUUID(), ...request };
    this.db.clientes = [...this.db.clientes, nuevo];
    return of(this.iniciarSesion(nuevo));
  }

  logout(): void {
    this.clienteActual.set(null);
  }

  /** Guarda la sesión sin la contraseña. */
  private iniciarSesion(cliente: ClienteMock): ClienteResponse {
    const datos: ClienteResponse = {
      publicId: cliente.publicId,
      nombre: cliente.nombre,
      email: cliente.email,
      telefono: cliente.telefono,
    };
    this.clienteActual.set(datos);
    return datos;
  }
}
