import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const TOKEN_KEY = 'mascotas_vete_token';

/**
 * Guarda y lee el token de sesión del ciudadano en el navegador.
 * Se aísla acá en vez de usar localStorage directo porque en el
 * renderizado del servidor (SSR) no existe localStorage: hay que
 * comprobar primero en qué entorno se está ejecutando el código.
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
