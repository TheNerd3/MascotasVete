import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Perfil } from '../models';

/**
 * Factory de guard: restringe una ruta a uno o mas perfiles
 * (ej: solo REFUGIO puede gestionar publicaciones de adopcion propias).
 * Uso en las rutas: canActivate: [perfilGuard([Perfil.Refugio])]
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
