import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MockDb } from '../mocks/mock-db';
import { ExcepcionRequest, ExcepcionResponse } from '../models/excepcion.model';

/** Simula /api/excepciones. */
@Injectable({ providedIn: 'root' })
export class ExcepcionService {
  private readonly db = inject(MockDb);

  listarPropias(): Observable<ExcepcionResponse[]> {
    return of([...this.db.excepciones]);
  }

  crear(request: ExcepcionRequest): Observable<ExcepcionResponse> {
    const nueva: ExcepcionResponse = { id: this.db.nuevoId(), ...request };
    this.db.excepciones = [...this.db.excepciones, nueva];
    return of(nueva);
  }

  eliminar(id: number): Observable<void> {
    this.db.excepciones = this.db.excepciones.filter((excepcion) => excepcion.id !== id);
    return of(undefined);
  }
}
