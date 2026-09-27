import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Impide entrar a una ruta si el ciudadano no inició sesión, y lo
 * manda a la pantalla de login. Se usa en las rutas que requieren
 * autenticación (RNF03: todo lo que no sea público la exige).
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estaAutenticado()) {
    return true;
  }

  return router.createUrlTree(['/auth/login']);
};
