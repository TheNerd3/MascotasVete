/**
 * Decodificacion "liviana" del payload de un JWT (sin verificar firma:
 * eso ya lo hizo el backend, aca solo se lee para poblar el estado de
 * la UI). No usar esto como mecanismo de seguridad del lado del cliente.
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

export function jwtExpirado(token: string): boolean {
  const payload = decodificarPayloadJwt<{ exp?: number }>(token);
  if (!payload?.exp) {
    return true;
  }
  const expiracionMs = payload.exp * 1000;
  return Date.now() >= expiracionMs;
}
