import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { perfilGuard } from './core/guards/perfil.guard';
import { Perfil } from './core/models';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./layout/auth-layout/auth-layout').then((m) => m.AuthLayout),
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'adopciones',
    loadComponent: () => import('./layout/app-layout/app-layout').then((m) => m.AppLayout),
    canActivate: [authGuard, perfilGuard([Perfil.Refugio])],
    loadChildren: () => import('./features/adopciones/adopciones.routes').then((m) => m.ADOPCIONES_ROUTES),
  },
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
  { path: '**', redirectTo: 'auth/login' },
];
