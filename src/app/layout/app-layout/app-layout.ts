import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthResource } from '../../core/services/auth-resource';
import { TopBar } from '../../shared/components';

/**
 * Estructura de las pantallas internas (ya con un usuario logueado):
 * barra de navegación arriba, contenido de la ruta activa debajo.
 */
@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TopBar],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.scss',
})
export class AppLayout {
  private readonly authResource = inject(AuthResource);

  readonly usuario = this.authResource.usuario;
}
