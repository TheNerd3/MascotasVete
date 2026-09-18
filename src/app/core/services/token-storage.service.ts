import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const TOKEN_KEY = 'mascotas_vete_token';

/**
 * Unico punto de acceso a localStorage para el token JWT. Aislado en un
 * servicio para que el resto del codigo no dependa de localStorage
 * directamente (mas facil de testear/mockear, y necesario porque en SSR
 * no existe localStorage del lado del servidor).
 */
@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  obtener(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    return localStorage.getItem(TOKEN_KEY);
  }

  guardar(token: string): void {
    if (!this.isBrowser) {
      return;
    }
    localStorage.setItem(TOKEN_KEY, token);
  }

  limpiar(): void {
    if (!this.isBrowser) {
      return;
    }
    localStorage.removeItem(TOKEN_KEY);
  }
}
