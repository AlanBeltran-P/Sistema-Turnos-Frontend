import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/inicio/inicio').then((m) => m.Inicio),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'reservar/:slug',
    loadComponent: () => import('./features/reserva/reserva').then((m) => m.Reserva),
  },
  {
    path: 'cancelar',
    loadComponent: () => import('./features/cancelar/cancelar').then((m) => m.Cancelar),
  },
  {
    path: 'cancelar/:token',
    loadComponent: () => import('./features/cancelar/cancelar').then((m) => m.Cancelar),
  },
  {
    path: 'panel',
    canActivate: [authGuard],
    loadComponent: () => import('./features/panel/panel-layout/panel-layout').then((m) => m.PanelLayout),
    children: [
      { path: '', redirectTo: 'agenda', pathMatch: 'full' },
      {
        path: 'agenda',
        loadComponent: () => import('./features/panel/agenda/agenda').then((m) => m.Agenda),
      },
      {
        path: 'servicios',
        loadComponent: () => import('./features/panel/servicios/servicios').then((m) => m.Servicios),
      },
      {
        path: 'disponibilidad',
        loadComponent: () =>
          import('./features/panel/disponibilidad/disponibilidad').then((m) => m.Disponibilidad),
      },
      {
        path: 'excepciones',
        loadComponent: () => import('./features/panel/excepciones/excepciones').then((m) => m.Excepciones),
      },
    ],
  },
];
