import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * Botón principal de ancho completo, con ícono opcional y un estado de
 * carga que muestra un spinner y se deshabilita solo, para no repetir
 * esa lógica en cada formulario:
 *
 *   <app-primary-button texto="Iniciar sesión" tipo="submit" [cargando]="cargando()" />
 */
@Component({
  selector: 'app-primary-button',
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './primary-button.html',
  styleUrl: './primary-button.scss',
})
export class PrimaryButton {
  readonly texto = input.required<string>();
  readonly textoCargando = input<string | null>(null);
  readonly icono = input<string | null>(null);
  readonly tipo = input<'button' | 'submit'>('button');
  readonly cargando = input(false);
  readonly deshabilitado = input(false);
  readonly color = input<'primary' | 'accent' | 'warn'>('primary');

  readonly clicked = output<void>();

  protected onClick(): void {
    if (!this.cargando() && !this.deshabilitado()) {
      this.clicked.emit();
    }
  }
}
