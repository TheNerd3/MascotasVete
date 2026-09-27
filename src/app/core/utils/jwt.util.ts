/**
 * Lee los datos guardados dentro de un token de sesión (JWT) sin
 * verificar su firma: esa verificación ya la hizo el backend al
 * generarlo. Solo se usa para mostrar datos en la pantalla, nunca
 * como control de seguridad del lado del navegador.
 */
export function decodificarPayloadJwt<T>(token: string): T | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) {
      return null;
    }
    const normalizado = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(normalizado);
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

/**
 * Indica si el token de sesión ya venció, comparando su fecha de
 * expiración contra la hora actual del navegador.
 */
export function jwtExpirado(token: string): boolean {
  const payload = decodificarPayloadJwt<{ exp?: number }>(token);
  if (!payload?.exp) {
    return true;
  }
  const expiracionMs = payload.exp * 1000;
  return Date.now() >= expiracionMs;
}
