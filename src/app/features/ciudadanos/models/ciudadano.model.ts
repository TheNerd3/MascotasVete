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

export interface RegistrarCiudadanoRequest {
  apellido: string;
  nombre: string;
  cuil: string;
  clave: string;
  correo?: string;
  telefono?: string;
  domicilio?: string;
}
