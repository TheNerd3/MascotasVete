import { Routes } from '@angular/router';

// RF18: listado publico de refugios habilitados, sin auth.
export const REFUGIOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../shared/components/en-construccion/en-construccion').then((m) => m.EnConstruccion),
    title: 'Refugios - Mascotas Córdoba',
  },
];
