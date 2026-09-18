import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

/**
 * Placeholder para secciones cuya pantalla todavia no se desarrollo.
 * Permite que las rutas de cada feature ya existan y naveguen
 * correctamente desde el primer momento, sin bloquear el resto de la
 * app mientras se van completando en PRs sucesivos.
 */
@Component({
  selector: 'app-en-construccion',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './en-construccion.html',
  styleUrl: './en-construccion.scss',
})
export class EnConstruccion {
  readonly titulo = input('Próximamente');
}
