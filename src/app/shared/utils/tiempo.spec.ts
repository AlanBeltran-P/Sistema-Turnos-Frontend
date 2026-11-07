import { vi } from 'vitest';
import { aHora, aMinutos, diaHabilEnDias, diaSemana, formatoFecha, sumarDias } from './tiempo';

describe('tiempo', () => {
  it('convierte "HH:mm" a minutos', () => {
    expect(aMinutos('09:30')).toBe(570);
  });

  it('convierte minutos a "HH:mm"', () => {
    expect(aHora(570)).toBe('09:30');
  });

  it('formatea una fecha como yyyy-MM-dd', () => {
    expect(formatoFecha(new Date(2030, 0, 7))).toBe('2030-01-07');
  });

  it('usa domingo = 0 igual que el back', () => {
    expect(diaSemana('2030-01-06')).toBe(0); // domingo
    expect(diaSemana('2030-01-07')).toBe(1); // lunes
  });
});

describe('sumarDias', () => {
  it('resta días cruzando de año', () => {
    expect(sumarDias('2030-01-07', -7)).toBe('2029-12-31');
  });

  it('suma días cruzando de mes', () => {
    expect(sumarDias('2030-01-31', 1)).toBe('2030-02-01');
  });
});

describe('diaHabilEnDias', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  function hoyEs(anio: number, mes: number, dia: number): void {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(anio, mes - 1, dia));
  }

  it('si hoy es día hábil, el día 0 es hoy', () => {
    hoyEs(2030, 1, 7); // lunes
    expect(diaHabilEnDias(0)).toBe('2030-01-07');
  });

  it('si hoy es sábado, el día 0 es el lunes', () => {
    hoyEs(2030, 1, 5); // sábado
    expect(diaHabilEnDias(0)).toBe('2030-01-07');
  });

  it('saltea el fin de semana al avanzar', () => {
    hoyEs(2030, 1, 10); // jueves
    expect(diaHabilEnDias(2)).toBe('2030-01-14'); // lunes
  });
});
