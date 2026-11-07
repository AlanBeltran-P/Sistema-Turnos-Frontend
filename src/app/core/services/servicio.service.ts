import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MockDb } from '../mocks/mock-db';
import { ServicioRequest, ServicioResponse } from '../models/servicio.model';

/** Simula /api/servicios. */
@Injectable({ providedIn: 'root' })
export class ServicioService {
  private readonly db = inject(MockDb);

  listarPropios(): Observable<ServicioResponse[]> {
    return of([...this.db.servicios]);
  }

  crear(request: ServicioRequest): Observable<ServicioResponse> {
    const nuevo: ServicioResponse = { publicId: crypto.randomUUID(), ...request, activo: true };
    this.db.servicios = [...this.db.servicios, nuevo];
    return of(nuevo);
  }

  actualizar(publicId: string, request: ServicioRequest): Observable<ServicioResponse> {
    this.db.servicios = this.db.servicios.map((servicio) =>
      servicio.publicId === publicId ? { ...servicio, ...request } : servicio,
    );
    return of(this.buscar(publicId));
  }

  desactivar(publicId: string): Observable<void> {
    this.db.servicios = this.db.servicios.map((servicio) =>
      servicio.publicId === publicId ? { ...servicio, activo: false } : servicio,
    );
    return of(undefined);
  }

  private buscar(publicId: string): ServicioResponse {
    return this.db.servicios.find((servicio) => servicio.publicId === publicId)!;
  }
}
