/**
 * Cuerpo de error estandar que devuelve el backend
 * (GlobalExceptionHandler / ErrorResponse en MascotasVeteBack).
 */
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}
