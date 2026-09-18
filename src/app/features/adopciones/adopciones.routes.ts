import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const ADOPCIONES_ROUTES: Routes = [
  {
    // RF18: listado publico de publicaciones activas, sin auth.
    path: '',
    loadComponent: () =>
      import('../../shared/components/en-construccion/en-construccion').then((m) => m.EnConstruccion),
    title: 'Adopciones - Mascotas Córdoba',
  },
  {
    // RF13: alta/gestion de publicaciones, solo refugios autenticados.
    path: 'gestionar',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../../shared/components/en-construccion/en-construccion').then((m) => m.EnConstruccion),
    title: 'Gestionar publicaciones - Mascotas Córdoba',
  },
];
