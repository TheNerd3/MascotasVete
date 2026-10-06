import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
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
  private readonly authService = inject(AuthService);

  readonly usuario = this.authService.usuario;
}
