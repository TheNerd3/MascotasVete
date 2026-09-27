import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Perfil } from '../models';

/**
 * Impide entrar a una ruta si el usuario logueado no tiene uno de los
 * perfiles permitidos (por ejemplo, solo refugios pueden gestionar sus
 * publicaciones de adopción, RF13).
 */
export function perfilGuard(perfilesPermitidos: Perfil[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const usuario = authService.usuario();

    if (usuario && perfilesPermitidos.includes(usuario.perfil)) {
      return true;
    }

    return router.createUrlTree(['/']);
  };
}
