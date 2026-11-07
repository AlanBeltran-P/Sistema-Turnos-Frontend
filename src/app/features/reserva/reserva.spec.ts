import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Reserva } from './reserva';

const LUNES = '2030-01-07';

describe('Reserva', () => {
  let fixture: ComponentFixture<Reserva>;

  async function abrirPantalla(slug: string): Promise<void> {
    TestBed.configureTestingModule({
      imports: [Reserva],
      providers: [{ provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ slug }) } } }],
    });
    fixture = TestBed.createComponent(Reserva);
    await fixture.whenStable();
  }

  function textoEnPantalla(): string {
    return (fixture.nativeElement as HTMLElement).textContent ?? '';
  }

  async function clickEnBoton(texto: string): Promise<void> {
    const botones = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('button'));
    botones.find((boton) => boton.textContent?.includes(texto))!.click();
    await fixture.whenStable();
  }

  async function escribir(nombreInput: string, valor: string): Promise<void> {
    const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>(`input[name="${nombreInput}"]`)!;
    input.value = valor;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  async function elegirCorteDelLunesALas9(): Promise<void> {
    await clickEnBoton('Corte de pelo');
    await escribir('fecha', LUNES);
    await clickEnBoton('09:00');
  }

  it('muestra los servicios del profesional', async () => {
    await abrirPantalla('laura-gomez');
    expect(textoEnPantalla()).toContain('Corte de pelo');
    expect(textoEnPantalla()).toContain('Coloración');
  });

  it('muestra un error si el profesional no existe', async () => {
    await abrirPantalla('no-existe');
    expect(textoEnPantalla()).toContain('Profesional no encontrado');
  });

  it('al elegir servicio y día muestra los horarios libres', async () => {
    await abrirPantalla('laura-gomez');
    await clickEnBoton('Corte de pelo');
    await escribir('fecha', LUNES);
    expect(textoEnPantalla()).toContain('09:00');
    expect(textoEnPantalla()).toContain('18:30');
  });

  it('reserva un turno y muestra el código de cancelación', async () => {
    await abrirPantalla('laura-gomez');
    await elegirCorteDelLunesALas9();
    await escribir('nombre', 'Ana López');
    await escribir('telefono', '11 1234-5678');
    await clickEnBoton('Reservar turno');
    expect(textoEnPantalla()).toContain('¡Turno reservado!');
    expect(fixture.nativeElement.querySelector('code')?.textContent).toBeTruthy();
  });

  it('no deja reservar sin nombre ni teléfono', async () => {
    await abrirPantalla('laura-gomez');
    await elegirCorteDelLunesALas9();
    const botonReservar = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(botonReservar.disabled).toBe(true);
  });

  it('permite cancelar el turno recién reservado', async () => {
    await abrirPantalla('laura-gomez');
    await elegirCorteDelLunesALas9();
    await escribir('nombre', 'Ana López');
    await escribir('telefono', '11 1234-5678');
    await clickEnBoton('Reservar turno');
    await clickEnBoton('Cancelar turno');
    expect(textoEnPantalla()).toContain('Turno cancelado');
  });
});
