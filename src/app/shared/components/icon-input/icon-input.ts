import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

/**
 * Input con icono a la izquierda (y toggle de mostrar/ocultar para
 * passwords), implementado como ControlValueAccessor para poder usarlo
 * exactamente igual que un <input> nativo con [formControlName] o
 * [(ngModel)] en cualquier feature, sin repetir el markup de
 * mat-form-field + mat-icon en cada formulario.
 *
 * Uso:
 *   <app-icon-input
 *     label="CUIL"
 *     icono="person"
 *     placeholder="Ingrese su CUIL"
 *     formControlName="cuil" />
 */
@Component({
  selector: 'app-icon-input',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
  templateUrl: './icon-input.html',
  styleUrl: './icon-input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IconInput),
      multi: true,
    },
  ],
})
export class IconInput implements ControlValueAccessor {
  readonly label = input<string | null>(null);
  readonly icono = input<string | null>(null);
  readonly placeholder = input('');
  readonly tipo = input<'text' | 'email' | 'password' | 'tel'>('text');
  readonly autocomplete = input('off');
  readonly errorTexto = input<string | null>(null);

  protected readonly valor = signal('');
  protected readonly deshabilitado = signal(false);
  protected readonly mostrarClave = signal(false);

  private onChange: (valor: string) => void = () => {};
  private onTouched: () => void = () => {};

  protected get tipoEfectivo(): string {
    if (this.tipo() !== 'password') {
      return this.tipo();
    }
    return this.mostrarClave() ? 'text' : 'password';
  }

  protected alternarMostrarClave(): void {
    this.mostrarClave.update((valor) => !valor);
  }

  protected manejarInput(valor: string): void {
    this.valor.set(valor);
    this.onChange(valor);
  }

  protected manejarBlur(): void {
    this.onTouched();
  }

  writeValue(valor: string): void {
    this.valor.set(valor ?? '');
  }

  registerOnChange(fn: (valor: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(deshabilitado: boolean): void {
    this.deshabilitado.set(deshabilitado);
  }
}
