import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

/**
 * Pantalla provisoria para secciones que todavía no están desarrolladas.
 * Permite que todas las rutas de la aplicación ya funcionen y se pueda
 * navegar entre ellas mientras cada sección se va completando de a poco.
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
