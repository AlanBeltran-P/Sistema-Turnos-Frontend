import { aHora, aMinutos, diaHabilEnDias, sumarDias } from '../../shared/utils/tiempo';
import { ClienteResponse } from '../models/cliente.model';
import { DisponibilidadResponse } from '../models/disponibilidad.model';
import { ExcepcionResponse } from '../models/excepcion.model';
import { ProfesionalResponse } from '../models/profesional.model';
import { ServicioResponse } from '../models/servicio.model';
import { EstadoTurno, TurnoAgendaResponse } from '../models/turno.model';

/** Turno tal como lo guarda el mock: lo que ve la agenda más los datos internos. */
export interface TurnoMock extends TurnoAgendaResponse {
  servicioPublicId: string;
  cancelacionToken: string;
  clientePublicId: string | null; // null = reservado sin cuenta
}

/** Cliente tal como lo guarda el mock: con contraseña. */
export interface ClienteMock extends ClienteResponse {
  password: string;
}

export const PROFESIONAL_MOCK: ProfesionalResponse = {
  publicId: '7b1c2f0e-0000-4000-8000-000000000001',
  nombre: 'Laura Gómez',
  email: 'laura@demo.com',
  slug: 'laura-gomez',
  telefono: '11 5555-1234',
};

export const CLIENTES_MOCK: ClienteMock[] = [
  {
    publicId: 'c3d9e1a0-0000-4000-8000-000000000001',
    nombre: 'Ana López',
    email: 'ana@demo.com',
    telefono: '11 1234-5678',
    password: '12345678',
  },
];

export const SERVICIOS_MOCK: ServicioResponse[] = [
  { publicId: 'a1f4c2d0-0000-4000-8000-000000000001', nombre: 'Corte de pelo', duracionMin: 30, precio: 8000, activo: true },
  { publicId: 'a1f4c2d0-0000-4000-8000-000000000002', nombre: 'Corte y barba', duracionMin: 45, precio: 11000, activo: true },
  { publicId: 'a1f4c2d0-0000-4000-8000-000000000003', nombre: 'Coloración', duracionMin: 90, precio: 25000, activo: true },
];

// Lunes a viernes de 9 a 13 y de 15 a 19, sábados de 9 a 13.
const DIAS_HABILES = [1, 2, 3, 4, 5];

export const DISPONIBILIDADES_MOCK: DisponibilidadResponse[] = [
  ...DIAS_HABILES.map((dia) => ({ id: dia, diaSemana: dia, horaInicio: '09:00', horaFin: '13:00' })),
  ...DIAS_HABILES.map((dia) => ({ id: dia + 10, diaSemana: dia, horaInicio: '15:00', horaFin: '19:00' })),
  { id: 6, diaSemana: 6, horaInicio: '09:00', horaFin: '13:00' },
];

export const EXCEPCIONES_MOCK: ExcepcionResponse[] = [
  { id: 1, fecha: diaHabilEnDias(2), horaInicio: '15:00', horaFin: '17:00', motivo: 'Trámite personal' },
  { id: 2, fecha: diaHabilEnDias(7), horaInicio: null, horaFin: null, motivo: 'Feriado' },
];

function turnoMock(
  publicId: string,
  servicio: ServicioResponse,
  fecha: string,
  hora: string,
  clienteNombre: string,
  estado: EstadoTurno,
): TurnoMock {
  const horaFin = aHora(aMinutos(hora) + servicio.duracionMin);
  return {
    publicId,
    servicioPublicId: servicio.publicId,
    servicioNombre: servicio.nombre,
    clienteNombre,
    clienteTelefono: '11 4000-0000',
    clienteEmail: null,
    fechaHoraInicio: `${fecha}T${hora}`,
    fechaHoraFin: `${fecha}T${horaFin}`,
    estado,
    cancelacionToken: `cancelar-${publicId}`,
    clientePublicId: null,
  };
}

/** Turno de ejemplo reservado por la clienta demo con su cuenta. */
function turnoDeAna(
  publicId: string,
  servicio: ServicioResponse,
  fecha: string,
  hora: string,
  estado: EstadoTurno,
): TurnoMock {
  const ana = CLIENTES_MOCK[0];
  return {
    ...turnoMock(publicId, servicio, fecha, hora, ana.nombre, estado),
    clientePublicId: ana.publicId,
    clienteTelefono: ana.telefono,
    clienteEmail: ana.email,
  };
}

const [corte, corteYBarba, coloracion] = SERVICIOS_MOCK;

export const TURNOS_MOCK: TurnoMock[] = [
  turnoMock('t-01', corte, diaHabilEnDias(0), '09:00', 'Martín Pérez', 'COMPLETADO'),
  turnoMock('t-02', corteYBarba, diaHabilEnDias(0), '10:00', 'Sofía Díaz', 'CONFIRMADO'),
  turnoMock('t-03', corte, diaHabilEnDias(1), '09:30', 'Juan Torres', 'PENDIENTE'),
  turnoMock('t-04', coloracion, diaHabilEnDias(1), '15:00', 'Camila Ruiz', 'PENDIENTE'),
  turnoMock('t-05', corte, diaHabilEnDias(2), '11:00', 'Lucas Romero', 'CANCELADO'),
  turnoDeAna('t-06', corteYBarba, sumarDias(diaHabilEnDias(0), -7), '11:00', 'COMPLETADO'),
  turnoDeAna('t-07', corte, diaHabilEnDias(3), '10:00', 'CONFIRMADO'),
];
