import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

/**
 * Campo de texto con un ícono a la izquierda (y botón de mostrar/ocultar
 * cuando es contraseña). Se usa en cualquier formulario igual que un
 * <input> común, con formControlName:
 *
 *   <app-icon-input label="CUIL" icono="person" formControlName="cuil" />
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
function sinOperacion(): void {}
@Component({
  selector: 'app-icon-input',
  imports: [FormsModule, MatIconModule],
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
  private static contadorInstancias = 0;

  readonly label = input<string | null>(null);
  readonly icono = input<string | null>(null);
  readonly placeholder = input('');
  readonly tipo = input<'text' | 'email' | 'password' | 'tel'>('text');
  readonly autocomplete = input('off');
  readonly errorTexto = input<string | null>(null);

  // Cada input necesita un id único para que su <label> lo pueda
  // referenciar, incluso cuando hay varios app-icon-input en la misma
  // pantalla (por ejemplo, el formulario de registro).
  protected readonly idCampo = `icon-input-${IconInput.contadorInstancias++}`;

  protected readonly valor = signal('');
  protected readonly deshabilitado = signal(false);
  protected readonly mostrarClave = signal(false);

  private onChange: (valor: string) => void = sinOperacion;
  private onTouched: () => void = sinOperacion;

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
