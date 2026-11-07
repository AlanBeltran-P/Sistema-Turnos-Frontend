import { Injectable } from '@angular/core';
import {
  CLIENTES_MOCK,
  DISPONIBILIDADES_MOCK,
  EXCEPCIONES_MOCK,
  PROFESIONAL_MOCK,
  SERVICIOS_MOCK,
  TURNOS_MOCK,
  TurnoMock,
} from './datos-mock';

/**
 * "Base de datos" en memoria compartida por todos los servicios.
 * Arranca con una copia de los datos de ejemplo; al recargar la página se reinicia.
 */
@Injectable({ providedIn: 'root' })
export class MockDb {
  readonly profesional = structuredClone(PROFESIONAL_MOCK);
  servicios = structuredClone(SERVICIOS_MOCK);
  disponibilidades = structuredClone(DISPONIBILIDADES_MOCK);
  excepciones = structuredClone(EXCEPCIONES_MOCK);
  turnos: TurnoMock[] = structuredClone(TURNOS_MOCK);
  clientes = structuredClone(CLIENTES_MOCK);

  private ultimoId = 100;

  nuevoId(): number {
    this.ultimoId++;
    return this.ultimoId;
  }
}
