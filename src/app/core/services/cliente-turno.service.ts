import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { aTurnoResponse } from '../mocks/mapeo-turnos';
import { MockDb } from '../mocks/mock-db';
import { TurnoResponse } from '../models/turno.model';
import { ClienteAuthService } from './cliente-auth.service';

/** Simula GET /api/cliente/turnos. No existe en el back. */
@Injectable({ providedIn: 'root' })
export class ClienteTurnoService {
  private readonly db = inject(MockDb);
  private readonly clienteAuth = inject(ClienteAuthService);

  /** Los turnos del cliente con sesión abierta, ordenados por fecha. */
  misTurnos(): Observable<TurnoResponse[]> {
    const cliente = this.clienteAuth.cliente();
    if (!cliente) {
      return throwError(() => new Error('Tenés que ingresar a tu cuenta'));
    }
    const turnos = this.db.turnos
      .filter((turno) => turno.clientePublicId === cliente.publicId)
      .sort((a, b) => a.fechaHoraInicio.localeCompare(b.fechaHoraInicio))
      .map(aTurnoResponse);
    return of(turnos);
  }
}
