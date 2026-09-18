import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CiudadanosService } from '../../../ciudadanos/services/ciudadanos.service';
import { ApiError } from '../../../../core/models';
import { BrandHeader } from '../../../../shared/components/brand-header/brand-header';
import { AuthCard } from '../../../../shared/components/auth-card/auth-card';
import { IconInput } from '../../../../shared/components/icon-input/icon-input';
import { PrimaryButton } from '../../../../shared/components/primary-button/primary-button';

@Component({
  selector: 'app-registro-page',
  imports: [ReactiveFormsModule, RouterLink, BrandHeader, AuthCard, IconInput, PrimaryButton],
  templateUrl: './registro-page.html',
  styleUrl: './registro-page.scss',
})
export class RegistroPage {
  private readonly fb = inject(FormBuilder);
  private readonly ciudadanosService = inject(CiudadanosService);
  private readonly router = inject(Router);

  readonly cargando = signal(false);
  readonly errorMensaje = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    apellido: ['', [Validators.required, Validators.maxLength(100)]],
    cuil: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    clave: ['', [Validators.required, Validators.minLength(6)]],
    correo: ['', [Validators.email]],
    telefono: [''],
    domicilio: [''],
  });

  get errorNombre(): string | null {
    return this.form.controls.nombre.touched && this.form.controls.nombre.hasError('required')
      ? 'El nombre es obligatorio'
      : null;
  }

  get errorApellido(): string | null {
    return this.form.controls.apellido.touched && this.form.controls.apellido.hasError('required')
      ? 'El apellido es obligatorio'
      : null;
  }

  get errorCuil(): string | null {
    const control = this.form.controls.cuil;
    if (!control.touched) return null;
    if (control.hasError('required')) return 'El CUIL es obligatorio';
    if (control.hasError('pattern')) return 'Debe tener 11 dígitos numéricos, sin guiones';
    return null;
  }

  get errorClave(): string | null {
    const control = this.form.controls.clave;
    if (!control.touched) return null;
    if (control.hasError('required')) return 'La contraseña es obligatoria';
    if (control.hasError('minlength')) return 'Debe tener al menos 6 caracteres';
    return null;
  }

  get errorCorreo(): string | null {
    return this.form.controls.correo.touched && this.form.controls.correo.hasError('email')
      ? 'Correo inválido'
      : null;
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.errorMensaje.set(null);

    this.ciudadanosService.registrar(this.form.getRawValue()).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigate(['/auth/login']);
      },
      error: (error: HttpErrorResponse) => {
        this.cargando.set(false);
        const apiError = error.error as ApiError | undefined;
        this.errorMensaje.set(apiError?.message ?? 'No se pudo completar el registro');
      },
    });
  }
}
