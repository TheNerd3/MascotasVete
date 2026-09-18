import { Perfil } from './perfil.enum';

/**
 * Datos del usuario autenticado que se guardan en sesion (derivados del
 * JWT) para uso en la UI: guards, menu segun perfil, ownership checks.
 */
export interface UsuarioAutenticado {
  idCiudadano: number;
  cuil: string;
  perfil: Perfil;
  nombre: string;
  apellido: string;
}
