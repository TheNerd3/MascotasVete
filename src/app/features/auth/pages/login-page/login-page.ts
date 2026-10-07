import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthResource } from '../../../../core/services/auth-resource';
import { ApiErrorLogin, Perfil } from '../../../../core/models';
import { BrandHeader } from '../../../../shared/components/brand-header/brand-header';
import { AuthCard } from '../../../../shared/components/auth-card/auth-card';
import { IconInput } from '../../../../shared/components/icon-input/icon-input';
import { PrimaryButton } from '../../../../shared/components/primary-button/primary-button';
import { environment } from '../../../../../environments/environment';

interface CredencialPrueba {
  etiqueta: string;
  cuil: string;
  clave: string;
}

/**
 * Pantalla de login del ciudadano. Implementa RF15: pide CUIL y
 * contraseña, y si son correctos guarda la sesión y entra a la app.
 */
@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, BrandHeader, AuthCard, IconInput, PrimaryButton],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly authResource = inject(AuthResource);
  private readonly router = inject(Router);

  readonly cargando = signal(false);
  readonly errorMensaje = signal<string | null>(null);

  // Solo se muestran en desarrollo (no en el build de producción), para
  // no tener que ir a buscar los datos de prueba cada vez.
  readonly mostrarCredencialesPrueba = !environment.production;
  readonly credencialesPrueba: CredencialPrueba[] = [
    { etiqueta: 'Refugio (Marcos Diaz)', cuil: '20345678906', clave: 'Prueba123!' },
    { etiqueta: 'Ciudadano (Ana Gimenez)', cuil: '20123456786', clave: 'Prueba123!' },
  ];

  readonly form = this.fb.nonNullable.group({
    cuil: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    clave: ['', [Validators.required]],
  });

  get errorCuil(): string | null {
    const control = this.form.controls.cuil;
    if (!control.touched) return null;
    if (control.hasError('required')) return 'El CUIL es obligatorio';
    if (control.hasError('pattern')) return 'Debe tener 11 dígitos numéricos, sin guiones';
    return null;
  }

  get errorClave(): string | null {
    const control = this.form.controls.clave;
    if (control.touched && control.hasError('required')) return 'La contraseña es obligatoria';
    return null;
  }

  protected usarCredencialPrueba(credencial: CredencialPrueba): void {
    this.form.setValue({ cuil: credencial.cuil, clave: credencial.clave });
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.errorMensaje.set(null);

    this.authResource.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigateByUrl(this.rutaSegunPerfil());
      },
      error: (error: HttpErrorResponse) => {
        this.cargando.set(false);
        this.errorMensaje.set(this.interpretarError(error));
      },
    });
  }

  private rutaSegunPerfil(): string {
    const perfil = this.authResource.usuario()?.perfil;

    if (perfil === Perfil.Refugio) {
      return '/adopciones/mis-publicaciones';
    }

    return '/';
  }

  private interpretarError(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Probá de nuevo en unos minutos.';
    }

    if (error.status === 401) {
      const errorLogin = error.error as ApiErrorLogin | undefined;
      return errorLogin?.mensaje ?? 'Usuario o clave incorrectos';
    }

    if (error.status === 400) {
      return 'Revisá los datos ingresados: hay campos incompletos o incorrectos.';
    }

    return 'Ocurrió un error inesperado. Probá de nuevo.';
  }
}
