import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/**
 * Cabecera de marca reutilizable: icono circular + titulo + subtitulo.
 * Se usa en el login, el registro, y cualquier otra pantalla que
 * necesite reforzar el branding institucional del programa municipal.
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
