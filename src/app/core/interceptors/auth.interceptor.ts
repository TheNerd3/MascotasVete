import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Agrega el header "Authorization: Bearer <token>" a cada request salvo
 * a las rutas publicas del backend (login, alta de ciudadano, listados
 * publicos), que no lo necesitan y no deberian fallar si el usuario no
 * esta logueado.
 */
const RUTAS_PUBLICAS = [
  '/auth/login',
  '/veterinarias',
  '/refugios',
  '/publicaciones',
  '/carnet/validar',
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.obtenerToken();

  const esRutaPublicaSinToken =
    !token || RUTAS_PUBLICAS.some((ruta) => req.url.includes(ruta));

  if (esRutaPublicaSinToken) {
    return next(req);
  }

  const requestConToken = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(requestConToken);
};
