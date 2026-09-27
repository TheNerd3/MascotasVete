import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

// Endpoints públicos del backend que no necesitan token: si el ciudadano
// no inició sesión, la petición igual tiene que funcionar.
const RUTAS_PUBLICAS = [
  '/auth/login',
  '/veterinarias',
  '/refugios',
  '/publicaciones',
  '/carnet/validar',
];

/**
 * Agrega el token de sesión a cada pedido al backend, salvo a los
 * endpoints públicos (login, listados de veterinarias/refugios, etc.).
 */
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
