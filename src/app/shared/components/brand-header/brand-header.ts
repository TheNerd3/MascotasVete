import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/**
 * Encabezado con el logo (ícono circular), el título y el subtítulo
 * institucional. Se usa en login, registro y cualquier otra pantalla
 * que necesite mostrar la marca del programa municipal.
 */
@Component({
  selector: 'app-brand-header',
  imports: [MatIconModule],
  templateUrl: './brand-header.html',
  styleUrl: './brand-header.scss',
})
export class BrandHeader {
  readonly icono = input('favorite');
  readonly titulo = input('Mascotas Córdoba');
  readonly subtitulo = input<string | null>('Programa Municipal de Bienestar Animal');
}
