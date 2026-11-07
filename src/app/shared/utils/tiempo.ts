/** Convierte "HH:mm" a minutos desde medianoche. */
export function aMinutos(hora: string): number {
  const [horas, minutos] = hora.split(':').map(Number);
  return horas * 60 + minutos;
}

/** Convierte minutos desde medianoche a "HH:mm". */
export function aHora(minutos: number): string {
  const horas = String(Math.floor(minutos / 60)).padStart(2, '0');
  const resto = String(minutos % 60).padStart(2, '0');
  return `${horas}:${resto}`;
}

/** Fecha local en formato "yyyy-MM-dd". */
export function formatoFecha(fecha: Date): string {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

/** Fecha "yyyy-MM-dd" de hoy más la cantidad de días indicada. */
export function fechaEnDias(dias: number): string {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  return formatoFecha(fecha);
}

/** Día de la semana con la convención del back: domingo = 0 ... sábado = 6. */
export function diaSemana(fecha: string): number {
  return new Date(`${fecha}T00:00`).getDay();
}
