import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'reservar/laura-gomez', pathMatch: 'full' },
  {
    path: 'reservar/:slug',
    loadComponent: () => import('./features/reserva/reserva').then((m) => m.Reserva),
  },
];
