import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('se crea la app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('tiene un router-outlet donde se muestran las pantallas', () => {
    const fixture = TestBed.createComponent(App);
    const pantalla = fixture.nativeElement as HTMLElement;
    expect(pantalla.querySelector('router-outlet')).toBeTruthy();
  });
});
