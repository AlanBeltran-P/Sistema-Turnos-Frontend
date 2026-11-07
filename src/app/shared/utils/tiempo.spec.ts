import { aHora, aMinutos, diaSemana, formatoFecha } from './tiempo';

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
