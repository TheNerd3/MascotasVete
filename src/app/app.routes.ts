import { Routes } from '@angular/router';

/**
 * Arbol de rutas raiz. Cada feature es un bundle lazy independiente
 * (loadChildren), asi el bundle inicial solo trae el shell + home.
 * Dos layouts conviven: MainLayout (navegacion completa) y AuthLayout
 * (minimal, para login/registro).
 */
export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./layout/auth-layout/auth-layout').then((m) => m.AuthLayout),
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./features/home/pages/home-page/home-page').then((m) => m.HomePage),
        title: 'Mascotas Córdoba',
      },
      {
        path: 'mascotas',
        loadChildren: () => import('./features/mascotas/mascotas.routes').then((m) => m.MASCOTAS_ROUTES),
      },
      {
        path: 'veterinarias',
        loadChildren: () =>
          import('./features/veterinarias/veterinarias.routes').then((m) => m.VETERINARIAS_ROUTES),
      },
      {
        path: 'refugios',
        loadChildren: () => import('./features/refugios/refugios.routes').then((m) => m.REFUGIOS_ROUTES),
      },
      {
        path: 'adopciones',
        loadChildren: () => import('./features/adopciones/adopciones.routes').then((m) => m.ADOPCIONES_ROUTES),
      },
      {
        path: 'asistente',
        loadComponent: () =>
          import('./shared/components/en-construccion/en-construccion').then((m) => m.EnConstruccion),
        title: 'Asistente virtual - Mascotas Córdoba',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
