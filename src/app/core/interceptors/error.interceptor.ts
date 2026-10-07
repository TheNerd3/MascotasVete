import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthResource } from '../services/auth-resource';

/**
 * Cierra la sesión y manda al login cuando el backend responde que el
 * token venció o no es válido (401), para que el ciudadano no se quede
 * viendo una pantalla rota.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authResource = inject(AuthResource);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authResource.logout();
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    }),
  );
};
