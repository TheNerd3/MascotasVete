import { Perfil } from './perfil.enum';

/**
 * Datos del ciudadano que inició sesión, guardados mientras dura la
 * visita para no tener que pedirlos de nuevo en cada pantalla.
 */
export interface UsuarioAutenticado {
  idCiudadano: number;
  cuil: string;
  perfil: Perfil;
  nombre: string;
  apellido: string;
  idRefugio: number | null;
  idVeterinaria: number | null;
}
