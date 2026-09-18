import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login-page/login-page').then((m) => m.LoginPage),
    title: 'Ingresar - Mascotas Córdoba',
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro-page/registro-page').then((m) => m.RegistroPage),
    title: 'Crear cuenta - Mascotas Córdoba',
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
];
