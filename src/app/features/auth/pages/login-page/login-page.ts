import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';
import { ApiError } from '../../../../core/models';
import { BrandHeader } from '../../../../shared/components/brand-header/brand-header';
import { AuthCard } from '../../../../shared/components/auth-card/auth-card';
import { IconInput } from '../../../../shared/components/icon-input/icon-input';
import { PrimaryButton } from '../../../../shared/components/primary-button/primary-button';

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
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly cargando = signal(false);
  readonly errorMensaje = signal<string | null>(null);

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

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.errorMensaje.set(null);

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigate(['/']);
      },
      error: (error: HttpErrorResponse) => {
        this.cargando.set(false);
        const apiError = error.error as ApiError | undefined;
        this.errorMensaje.set(apiError?.message ?? 'Cuil o clave incorrectos');
      },
    });
  }
}
