import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Agrega el token de sesión a cada pedido al backend, si hay uno
 * guardado. No hace falta distinguir rutas públicas de privadas acá:
 * mandar el header de más en un endpoint público (veterinarias,
 * refugios, publicaciones activas, validar carnet) no cambia nada,
 * porque el backend decide esa parte (SecurityConfig con permitAll).
 * Antes esto se resolvía con una lista de rutas "públicas" matcheadas
 * con includes(), que terminaba bloqueando sin querer el token en
 * rutas de escritura que comparten el mismo prefijo que una pública
 * (ej: POST /publicaciones vs el GET público de /publicaciones).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.obtenerToken();

  if (!token) {
    return next(req);
  }

  const requestConToken = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(requestConToken);
};
