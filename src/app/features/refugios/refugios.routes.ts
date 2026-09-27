import { Routes } from '@angular/router';

/** Listado público de refugios adheridos al programa (RF18). */
export const REFUGIOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../shared/components/en-construccion/en-construccion').then((m) => m.EnConstruccion),
    title: 'Refugios - Mascotas Córdoba',
  },
];
