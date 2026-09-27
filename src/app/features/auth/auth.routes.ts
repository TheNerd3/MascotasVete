import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login-page/login-page').then((m) => m.LoginPage),
    title: 'Ingresar - Mascotas Córdoba',
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
];
