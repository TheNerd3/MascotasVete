import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

/**
 * Publicaciones de adopción de los refugios: el listado público (RF18)
 * y la gestión, que solo pueden hacer los refugios logueados (RF13).
 */
export const ADOPCIONES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../shared/components/en-construccion/en-construccion').then((m) => m.EnConstruccion),
    title: 'Adopciones - Mascotas Córdoba',
  },
  {
    path: 'gestionar',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../../shared/components/en-construccion/en-construccion').then((m) => m.EnConstruccion),
    title: 'Gestionar publicaciones - Mascotas Córdoba',
  },
];
