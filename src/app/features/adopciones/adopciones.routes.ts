import { Routes } from '@angular/router';

export const ADOPCIONES_ROUTES: Routes = [
  {
    path: 'mis-publicaciones',
    loadComponent: () =>
      import('./pages/mis-publicaciones-page/mis-publicaciones-page').then((m) => m.MisPublicacionesPage),
    title: 'Mis publicaciones de adopción - Mascotas Córdoba',
  },
];
