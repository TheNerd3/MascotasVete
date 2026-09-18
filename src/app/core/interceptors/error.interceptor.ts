import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Manejo centralizado de errores HTTP:
 * - 401 (token invalido/expirado): limpia la sesion y redirige a login,
 *   asi ningun componente tiene que reimplementar esa logica.
 * - El resto de los errores se re-lanzan tal cual (con el ApiError del
 *   backend en error.error) para que cada feature los muestre como
 *   corresponda (snackbar, mensaje en el formulario, etc).
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    }),
  );
};
