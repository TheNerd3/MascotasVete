import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Cómo se genera cada página en el servidor. La página de inicio se
 * arma una sola vez de antemano (Prerender) porque siempre muestra lo
 * mismo. El resto se genera en cada visita (Server) porque depende de
 * la sesión del ciudadano o de datos que cambian, como una mascota
 * puntual.
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
