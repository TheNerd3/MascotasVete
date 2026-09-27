/**
 * Roles con los que un usuario puede quedar autenticado en el sistema
 * (RF15). El backend decide cuál corresponde según cómo esa persona
 * está vinculada en la base: dueño de mascota, responsable de refugio,
 * profesional de una veterinaria o personal municipal.
 */
export enum Perfil {
  Ciudadano = 'CIUDADANO',
  Refugio = 'REFUGIO',
  Veterinaria = 'VETERINARIA',
  Municipalidad = 'MUNICIPALIDAD',
}
