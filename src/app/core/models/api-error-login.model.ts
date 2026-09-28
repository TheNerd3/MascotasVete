/**
 * Formato con el que el backend informa un error de login (401),
 * distinto del formato general de error (ApiError).
 */
export interface ApiErrorLogin {
  codigo: string;
  mensaje: string;
}
