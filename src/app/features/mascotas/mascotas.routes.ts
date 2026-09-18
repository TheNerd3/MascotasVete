import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

/**
 * RF06 (registrar mascota), RF20 (consultar mis mascotas). Todas
 * requieren sesion: el ciudadano gestiona sus propias mascotas.
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
