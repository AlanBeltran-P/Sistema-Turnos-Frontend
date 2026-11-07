import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MockDb } from '../mocks/mock-db';
import { DisponibilidadRequest, DisponibilidadResponse } from '../models/disponibilidad.model';

/** Simula /api/disponibilidad. */
@Injectable({ providedIn: 'root' })
export class DisponibilidadService {
  private readonly db = inject(MockDb);

  listarPropias(): Observable<DisponibilidadResponse[]> {
    return of([...this.db.disponibilidades]);
  }

  crear(request: DisponibilidadRequest): Observable<DisponibilidadResponse> {
    const nueva: DisponibilidadResponse = { id: this.db.nuevoId(), ...request };
    this.db.disponibilidades = [...this.db.disponibilidades, nueva];
    return of(nueva);
  }

  actualizar(id: number, request: DisponibilidadRequest): Observable<DisponibilidadResponse> {
    const actualizada: DisponibilidadResponse = { id, ...request };
    this.db.disponibilidades = this.db.disponibilidades.map((disponibilidad) =>
      disponibilidad.id === id ? actualizada : disponibilidad,
    );
    return of(actualizada);
  }

  eliminar(id: number): Observable<void> {
    this.db.disponibilidades = this.db.disponibilidades.filter((disponibilidad) => disponibilidad.id !== id);
    return of(undefined);
  }
}
