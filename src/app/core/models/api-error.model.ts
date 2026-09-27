/**
 * Formato con el que el backend informa un error (código HTTP y
 * mensaje en español, listo para mostrarle al ciudadano).
 */
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}
