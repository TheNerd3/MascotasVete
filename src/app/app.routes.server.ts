import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Modo de renderizado por ruta para SSR:
 * - Prerender solo para la home (contenido estatico, ideal para SEO
 *   y carga instantanea).
 * - Server para el resto: hay rutas dinamicas (ej: mascotas/:nrm) y
 *   paginas que dependen de sesion/datos en tiempo real, que no se
 *   pueden precalcular en build time.
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
