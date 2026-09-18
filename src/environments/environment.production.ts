export const environment = {
  production: true,
  // En produccion, la URL real del backend se define en el pipeline de
  // build/deploy (reemplazo de este archivo o variable de entorno del
  // servidor que sirve el bundle), nunca hardcodeada en el repo.
  apiUrl: '/api',
};
