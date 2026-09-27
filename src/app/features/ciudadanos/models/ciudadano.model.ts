/**
 * Datos de un ciudadano tal como los devuelve el backend. Nunca incluye
 * la clave: el backend no la manda de vuelta por seguridad.
 */
export interface Ciudadano {
  idCiudadano: number;
  apellido: string;
  nombre: string;
  cuil: string;
  correo: string | null;
  telefono: string | null;
  domicilio: string | null;
  habilitado: boolean;
}
