import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { clickEnBoton, escribir, textoEnPantalla } from '../../shared/testing/pantalla';
import { Cancelar } from './cancelar';

describe('Cancelar', () => {
  let fixture: ComponentFixture<unknown>;

  async function abrir(url: string): Promise<void> {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'cancelar', component: Cancelar },
          { path: 'cancelar/:token', component: Cancelar },
        ]),
      ],
    });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(url);
    fixture = harness.fixture;
    await fixture.whenStable();
  }

  it('si llega con el link, el código ya está cargado', async () => {
    await abrir('/cancelar/cancelar-t-03');
    const input = fixture.nativeElement.querySelector('input[name="codigo"]') as HTMLInputElement;
    expect(input.value).toBe('cancelar-t-03');
  });

  it('cancela el turno con un código válido', async () => {
    await abrir('/cancelar/cancelar-t-03');
    await clickEnBoton(fixture, 'Cancelar turno');
    expect(textoEnPantalla(fixture)).toContain('Turno cancelado');
  });

  it('muestra un error si el código no existe', async () => {
    await abrir('/cancelar');
    await escribir(fixture, 'codigo', 'codigo-inventado');
    await clickEnBoton(fixture, 'Cancelar turno');
    expect(textoEnPantalla(fixture)).toContain('Turno no encontrado');
  });

  it('avisa si el turno ya estaba cancelado', async () => {
    await abrir('/cancelar/cancelar-t-05');
    await clickEnBoton(fixture, 'Cancelar turno');
    expect(textoEnPantalla(fixture)).toContain('El turno ya está cancelado');
  });
});
