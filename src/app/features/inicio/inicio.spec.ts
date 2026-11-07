import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Inicio } from './inicio';

describe('Inicio', () => {
  let fixture: ComponentFixture<Inicio>;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [Inicio], providers: [provideRouter([])] });
    fixture = TestBed.createComponent(Inicio);
    await fixture.whenStable();
  });

  function tieneLink(href: string): boolean {
    return fixture.nativeElement.querySelector(`a[href="${href}"]`) !== null;
  }

  it('tiene la entrada para clientes: reservar y cancelar', () => {
    expect(tieneLink('/reservar/laura-gomez')).toBe(true);
    expect(tieneLink('/cancelar')).toBe(true);
    expect(tieneLink('/cliente/turnos')).toBe(true);
  });

  it('tiene la entrada para profesionales', () => {
    expect(tieneLink('/login')).toBe(true);
  });
});
