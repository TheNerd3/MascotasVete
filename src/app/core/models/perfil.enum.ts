/**
 * Perfiles de usuario que puede devolver el backend en el JWT
 * (ver POST /api/auth/login). Debe mantenerse en sincronia con los
 * valores que emite LocalAuthService en MascotasVeteBack.
 */
export enum Perfil {
  Ciudadano = 'CIUDADANO',
  Refugio = 'REFUGIO',
  Veterinaria = 'VETERINARIA',
  Municipalidad = 'MUNICIPALIDAD',
}
