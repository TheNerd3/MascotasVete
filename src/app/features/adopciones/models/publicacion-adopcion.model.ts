export type EstadoPublicacion = 'Activa' | 'Pausada' | 'Finalizada';

/**
 * Publicación de adopción tal como la devuelve el backend
 * (GET /publicaciones, RF13/RF18).
 */
export interface PublicacionAdopcion {
  nroPublicacion: number;
  nroRegMunicipal: number;
  nombreMascota: string;
  sexoMascota: 'M' | 'H';
  anioNacimientoMascota: number | null;
  idRefugio: number;
  fechaPublicacion: string;
  caracteristicasMascota: string | null;
  condicionAdopcion: string | null;
  estadoPublicacion: EstadoPublicacion;
}
