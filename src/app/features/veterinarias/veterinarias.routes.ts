import { Routes } from '@angular/router';

// RF17: listado publico de veterinarias habilitadas, sin auth.
export const VETERINARIAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../shared/components/en-construccion/en-construccion').then((m) => m.EnConstruccion),
    title: 'Veterinarias - Mascotas Córdoba',
  },
];
