import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ClienteAuthService } from '../../../core/services/cliente-auth.service';
import { clickEnBoton, textoEnPantalla } from '../../../shared/testing/pantalla';
import { MisTurnos } from './mis-turnos';

describe('MisTurnos', () => {
  let fixture: ComponentFixture<MisTurnos>;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [MisTurnos], providers: [provideRouter([])] });
    await firstValueFrom(TestBed.inject(ClienteAuthService).login({ email: 'ana@demo.com', password: '12345678' }));
    fixture = TestBed.createComponent(MisTurnos);
    await fixture.whenStable();
  });

  function cantidadConEstado(estado: string): number {
    return fixture.nativeElement.querySelectorAll(`[data-estado="${estado}"]`).length;
  }

  it('muestra el turno próximo con su botón para cancelar', () => {
    expect(textoEnPantalla(fixture)).toContain('Corte de pelo');
    expect(cantidadConEstado('CONFIRMADO')).toBe(1);
  });

  it('muestra el turno pasado en el historial', () => {
    expect(textoEnPantalla(fixture)).toContain('Corte y barba');
    expect(cantidadConEstado('COMPLETADO')).toBe(1);
  });

  it('al cancelar, el turno pasa al historial', async () => {
    await clickEnBoton(fixture, 'Cancelar');
    expect(textoEnPantalla(fixture)).toContain('No tenés turnos próximos');
    expect(cantidadConEstado('CANCELADO')).toBe(1);
  });
});
