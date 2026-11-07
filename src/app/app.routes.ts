import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'reservar/:slug',
    loadComponent: () => import('./features/reserva/reserva').then((m) => m.Reserva),
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
    ],
  },
];
