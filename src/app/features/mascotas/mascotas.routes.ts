import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

/**
 * Rutas de mascotas del ciudadano logueado: ver las propias (RF20),
 * registrar una nueva (RF06) y ver el carnet sanitario digital
 * (RF10/RF11). Todas requieren sesión iniciada.
 */
export const MASCOTAS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../../shared/components/en-construccion/en-construccion').then((m) => m.EnConstruccion),
    title: 'Mis mascotas - Mascotas Córdoba',
  },
  {
    path: 'nueva',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../../shared/components/en-construccion/en-construccion').then((m) => m.EnConstruccion),
    title: 'Registrar mascota - Mascotas Córdoba',
  },
  {
    path: ':nrm/carnet',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../../shared/components/en-construccion/en-construccion').then((m) => m.EnConstruccion),
    title: 'Carnet sanitario - Mascotas Córdoba',
  },
];
