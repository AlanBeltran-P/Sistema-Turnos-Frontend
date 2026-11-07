import { calcularSlots, DatosAgenda } from './calculadora-slots';

const LUNES = '2030-01-07';
const MARTES = '2030-01-08';

/** Un profesional que solo atiende los lunes de 9 a 11. */
function agendaDeLunes(): DatosAgenda {
  return {
    disponibilidades: [{ id: 1, diaSemana: 1, horaInicio: '09:00', horaFin: '11:00' }],
    excepciones: [],
    turnos: [],
  };
}

function horasDeInicio(datos: DatosAgenda, duracionMin: number): string[] {
  return calcularSlots(datos, LUNES, duracionMin).map((slot) => slot.horaInicio);
}

describe('calcularSlots', () => {
  it('divide la disponibilidad en slots del largo del servicio', () => {
    expect(horasDeInicio(agendaDeLunes(), 30)).toEqual(['09:00', '09:30', '10:00', '10:30']);
  });

  it('no arma un slot que se pase del horario', () => {
    expect(horasDeInicio(agendaDeLunes(), 45)).toEqual(['09:00', '09:45']);
  });

  it('no devuelve nada si ese día no se atiende', () => {
    expect(calcularSlots(agendaDeLunes(), MARTES, 30)).toEqual([]);
  });

  it('saca los horarios bloqueados por una excepción', () => {
    const datos = agendaDeLunes();
    datos.excepciones = [{ id: 1, fecha: LUNES, horaInicio: '09:30', horaFin: '10:00', motivo: null }];
    expect(horasDeInicio(datos, 30)).toEqual(['09:00', '10:00', '10:30']);
  });

  it('una excepción sin horas bloquea el día completo', () => {
    const datos = agendaDeLunes();
    datos.excepciones = [{ id: 1, fecha: LUNES, horaInicio: null, horaFin: null, motivo: 'Feriado' }];
    expect(horasDeInicio(datos, 30)).toEqual([]);
  });

  it('saca los horarios que ya tienen turno', () => {
    const datos = agendaDeLunes();
    datos.turnos = [{ fechaHoraInicio: `${LUNES}T10:00`, fechaHoraFin: `${LUNES}T10:30`, estado: 'PENDIENTE' }];
    expect(horasDeInicio(datos, 30)).toEqual(['09:00', '09:30', '10:30']);
  });

  it('un turno cancelado deja el horario libre', () => {
    const datos = agendaDeLunes();
    datos.turnos = [{ fechaHoraInicio: `${LUNES}T10:00`, fechaHoraFin: `${LUNES}T10:30`, estado: 'CANCELADO' }];
    expect(horasDeInicio(datos, 30)).toEqual(['09:00', '09:30', '10:00', '10:30']);
  });
});
