export type EstadoPublicacion = 'Activa' | 'Pausada' | 'Finalizada';

export type AccionPublicacion = 'ACTIVAR' | 'PAUSAR' | 'FINALIZAR';

/**
 * Publicación de adopción tal como la devuelve el backend
 * (GET /publicaciones, RF13/RF18). accionesDisponibles le dice a la UI
 * qué botones mostrar según el estado actual, sin reimplementar la
 * máquina de estados del backend.
 */
export interface PublicacionAdopcion {
  nroPublicacion: number;
  nroRegMunicipal: number;
  nombreMascota: string;
  sexoMascota: 'M' | 'H';
  anioNacimientoMascota: number | null;
  especieMascota: string | null;
  razaMascota: string | null;
  idRefugio: number;
  fechaPublicacion: string;
  caracteristicasMascota: string | null;
  condicionAdopcion: string | null;
  estadoPublicacion: EstadoPublicacion;
  accionesDisponibles: AccionPublicacion[];
  fotoExiste: boolean;
}

/**
 * Página de resultados tal como la devuelve Spring Data con
 * PageSerializationMode.VIA_DTO (Page<T>, GET /publicaciones): los
 * metadatos de paginación van anidados bajo "page", no al nivel raíz.
 */
export interface PaginaPublicaciones {
  content: PublicacionAdopcion[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

/**
 * POST /publicaciones: datos de la mascota, si no existe todavía en
 * el registro. Sin idResponsable ni propietario, el backend la deja a
 * cargo del responsable legal del refugio autenticado.
 */
export interface RegistrarMascota {
  nombre: string;
  sexo: 'M' | 'H';
  anioNacimiento?: number | null;
  microchip?: string | null;
  caracteristicas: CaracteristicaMascota[];
}

export interface CaracteristicaMascota {
  codRasgo: number;
  nroValorDominio: number;
  valor?: string | null;
}

/** POST /publicaciones. foto es la imagen codificada en base64 (sin el prefijo data:...;base64,). */
export interface CrearPublicacion {
  nroRegMunicipal?: number | null;
  mascota?: RegistrarMascota | null;
  caracteristicasMascota?: string | null;
  condicionAdopcion?: string | null;
  foto?: string | null;
}

/** PATCH /publicaciones/{id}/estado. */
export interface CambiarEstadoPublicacion {
  accion: AccionPublicacion;
}

/** GET /catalogos/especies | /catalogos/razas. */
export interface ValorCatalogo {
  codRasgo: number;
  nroValorDominio: number;
  nombre: string;
}
