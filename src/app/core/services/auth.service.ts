import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MockDb } from '../mocks/mock-db';
import { AuthRequest, AuthResponse, ProfesionalResponse } from '../models/profesional.model';

/** Simula POST /api/auth/login: acepta cualquier email y contraseña. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly db = inject(MockDb);
  private readonly token = signal<string | null>(null);

  readonly estaLogueado = computed(() => this.token() !== null);

  login(request: AuthRequest): Observable<AuthResponse> {
    const respuesta: AuthResponse = { token: `token-mock-${request.email}` };
    this.token.set(respuesta.token);
    return of(respuesta);
  }

  logout(): void {
    this.token.set(null);
  }

  /** El back no tiene endpoint de perfil; por ahora sale del mock. */
  profesional(): ProfesionalResponse {
    return this.db.profesional;
  }
}
