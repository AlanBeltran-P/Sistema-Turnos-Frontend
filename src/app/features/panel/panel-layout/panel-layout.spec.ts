import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { vi } from 'vitest';
import { AuthService } from '../../../core/services/auth.service';
import { clickEnBoton, textoEnPantalla } from '../../../shared/testing/pantalla';
import { PanelLayout } from './panel-layout';

describe('PanelLayout', () => {
  let fixture: ComponentFixture<PanelLayout>;
  let router: Router;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [PanelLayout], providers: [provideRouter([])] });
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(PanelLayout);
    await fixture.whenStable();
  });

  it('muestra el nombre del profesional', () => {
    expect(textoEnPantalla(fixture)).toContain('Laura Gómez');
  });

  it('tiene el link a la página pública de reservas', () => {
    expect(fixture.nativeElement.querySelector('a[href="/reservar/laura-gomez"]')).toBeTruthy();
  });

  it('al salir cierra la sesión y vuelve al login', async () => {
    const auth = TestBed.inject(AuthService);
    await firstValueFrom(auth.login({ email: 'laura@demo.com', password: '12345678' }));
    await clickEnBoton(fixture, 'Salir');
    expect(auth.estaLogueado()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
