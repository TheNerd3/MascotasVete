import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * Boton de accion principal, ancho completo, con icono opcional y
 * estado de carga integrado (spinner + deshabilitado). Evita repetir
 * el mismo bloque @if(cargando) / mat-spinner en cada formulario.
 *
 * Uso:
 *   <app-primary-button
 *     texto="Iniciar sesión"
 *     icono="login"
 *     tipo="submit"
 *     [cargando]="cargando()"
 *     [deshabilitado]="form.invalid" />
 */
@Component({
  selector: 'app-primary-button',
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './primary-button.html',
  styleUrl: './primary-button.scss',
})
export class PrimaryButton {
  readonly texto = input.required<string>();
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
