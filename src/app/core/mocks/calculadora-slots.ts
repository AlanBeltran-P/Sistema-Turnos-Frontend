import { aHora, aMinutos, diaSemana } from '../../shared/utils/tiempo';
import { DisponibilidadResponse, SlotDisponibleResponse } from '../models/disponibilidad.model';
import { ExcepcionResponse } from '../models/excepcion.model';
import { TurnoAgendaResponse } from '../models/turno.model';

/** Rango horario en minutos desde medianoche. */
interface Rango {
  inicio: number;
  fin: number;
}

type TurnoOcupable = Pick<TurnoAgendaResponse, 'fechaHoraInicio' | 'fechaHoraFin' | 'estado'>;

export interface DatosAgenda {
  disponibilidades: DisponibilidadResponse[];
  excepciones: ExcepcionResponse[];
  turnos: TurnoOcupable[];
}

/** Misma lógica que DisponibilidadCalculatorService del back. */
export function calcularSlots(datos: DatosAgenda, fecha: string, duracionMin: number): SlotDisponibleResponse[] {
  const bloquesBase = datos.disponibilidades
    .filter((disponibilidad) => disponibilidad.diaSemana === diaSemana(fecha))
    .map((disponibilidad) => crearRango(disponibilidad.horaInicio, disponibilidad.horaFin));
  const excepcionesDelDia = datos.excepciones.filter((excepcion) => excepcion.fecha === fecha);
  const bloquesLibres = restarExcepciones(bloquesBase, excepcionesDelDia);
  const ocupados = turnosOcupados(datos.turnos, fecha);

  return generarSlots(bloquesLibres, duracionMin)
    .filter((slot) => !ocupados.some((turno) => seSuperponen(slot, turno)))
    .map((slot) => ({ horaInicio: aHora(slot.inicio), horaFin: aHora(slot.fin) }));
}

function crearRango(horaInicio: string, horaFin: string): Rango {
  return { inicio: aMinutos(horaInicio), fin: aMinutos(horaFin) };
}

function restarExcepciones(bloques: Rango[], excepciones: ExcepcionResponse[]): Rango[] {
  let resultado = bloques;
  for (const excepcion of excepciones) {
    if (excepcion.horaInicio === null || excepcion.horaFin === null) {
      return []; // Bloqueo de día completo: no queda nada libre
    }
    const bloqueo = crearRango(excepcion.horaInicio, excepcion.horaFin);
    resultado = resultado.flatMap((bloque) => recortar(bloque, bloqueo));
  }
  return resultado;
}

/** Resta el bloqueo del bloque: puede quedar en 0, 1 o 2 pedazos. */
function recortar(bloque: Rango, bloqueo: Rango): Rango[] {
  if (!seSuperponen(bloque, bloqueo)) {
    return [bloque];
  }
  const pedazos: Rango[] = [];
  if (bloque.inicio < bloqueo.inicio) {
    pedazos.push({ inicio: bloque.inicio, fin: bloqueo.inicio });
  }
  if (bloqueo.fin < bloque.fin) {
    pedazos.push({ inicio: bloqueo.fin, fin: bloque.fin });
  }
  return pedazos;
}

function generarSlots(bloques: Rango[], duracionMin: number): Rango[] {
  const slots: Rango[] = [];
  for (const bloque of bloques) {
    for (let inicio = bloque.inicio; inicio + duracionMin <= bloque.fin; inicio += duracionMin) {
      slots.push({ inicio, fin: inicio + duracionMin });
    }
  }
  return slots;
}

function turnosOcupados(turnos: TurnoOcupable[], fecha: string): Rango[] {
  return turnos
    .filter((turno) => turno.estado !== 'CANCELADO' && turno.fechaHoraInicio.startsWith(fecha))
    .map((turno) => crearRango(turno.fechaHoraInicio.slice(11, 16), turno.fechaHoraFin.slice(11, 16)));
}

function seSuperponen(a: Rango, b: Rango): boolean {
  return a.inicio < b.fin && b.inicio < a.fin;
}
