import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./layout/auth-layout/auth-layout').then((m) => m.AuthLayout),
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
  { path: '**', redirectTo: 'auth/login' },
];
