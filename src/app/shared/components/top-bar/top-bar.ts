import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/**
 * Barra de navegación superior de la app ya logueada (distinta del
 * app-brand-header, que es para las pantallas de login/registro). Se
 * usa igual en cualquier pantalla interna:
 *
 *   <app-top-bar cuil="27-12345678-9">
 *     <a routerLink="/adopciones/mis-publicaciones">Publicaciones</a>
 *   </app-top-bar>
 */
@Component({
  selector: 'app-top-bar',
  imports: [MatIconModule],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.scss',
})
export class TopBar {
  readonly titulo = input('Mascotas Córdoba');
  readonly cuil = input<string | null>(null);
}
