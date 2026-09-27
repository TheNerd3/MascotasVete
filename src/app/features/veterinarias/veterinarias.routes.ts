import { Routes } from '@angular/router';

/** Listado público de veterinarias adheridas al programa (RF17). */
export const VETERINARIAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../shared/components/en-construccion/en-construccion').then((m) => m.EnConstruccion),
    title: 'Veterinarias - Mascotas Córdoba',
  },
];
