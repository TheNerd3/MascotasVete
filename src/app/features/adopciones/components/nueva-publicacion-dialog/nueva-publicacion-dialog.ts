import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { IconInput } from '../../../../shared/components/icon-input/icon-input';
import { PrimaryButton } from '../../../../shared/components/primary-button/primary-button';
import { PublicacionesResource } from '../../services/publicaciones-resource';
import { CrearPublicacion, PublicacionAdopcion, ValorCatalogo } from '../../interfaces/publicacion-adopcion.model';

/**
 * RF13 - Alta de publicación de adopción. La mascota se registra en el
 * mismo flujo (todavía no está en el registro municipal): el backend
 * la deja a cargo del responsable legal del refugio autenticado, así
 * que el formulario no pide datos de propietario.
 */
@Component({
  selector: 'app-nueva-publicacion-dialog',
  imports: [ReactiveFormsModule, MatIconModule, MatFormFieldModule, MatSelectModule, IconInput, PrimaryButton],
  templateUrl: './nueva-publicacion-dialog.html',
  styleUrl: './nueva-publicacion-dialog.scss',
})
export class NuevaPublicacionDialog implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<NuevaPublicacionDialog>);
  private readonly publicacionesResource = inject(PublicacionesResource);

  protected readonly cargando = signal(false);
  protected readonly errorMensaje = signal<string | null>(null);
  protected readonly especies = signal<ValorCatalogo[]>([]);
  protected readonly razas = signal<ValorCatalogo[]>([]);
  protected readonly nombreArchivoFoto = signal<string | null>(null);

  private fotoBase64: string | null = null;

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    especie: this.fb.control<ValorCatalogo | null>(null, [Validators.required]),
    sexo: ['M' as 'M' | 'H', [Validators.required]],
    anioNacimiento: this.fb.control<number | null>(null),
    raza: this.fb.control<ValorCatalogo | null>(null),
    caracteristicasMascota: ['', [Validators.required]],
    condicionAdopcion: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.publicacionesResource.listarEspecies().subscribe((especies) => this.especies.set(especies));
    this.publicacionesResource.listarRazas().subscribe((razas) => this.razas.set(razas));
  }

  protected cerrar(): void {
    this.dialogRef.close();
  }

  protected seleccionarFoto(evento: Event): void {
    const archivo = (evento.target as HTMLInputElement).files?.[0];
    if (!archivo) {
      this.nombreArchivoFoto.set(null);
      this.fotoBase64 = null;
      return;
    }

    this.nombreArchivoFoto.set(archivo.name);

    const lector = new FileReader();
    lector.onload = () => {
      // readAsDataURL da "data:image/png;base64,AAAA...": el backend
      // solo necesita la parte de base64, sin el prefijo.
      const resultado = lector.result as string;
      this.fotoBase64 = resultado.substring(resultado.indexOf(',') + 1);
    };
    lector.readAsDataURL(archivo);
  }

  protected enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.errorMensaje.set(null);

    this.publicacionesResource.crear(this.armarRequest()).subscribe({
      next: (publicacion: PublicacionAdopcion) => {
        this.cargando.set(false);
        this.dialogRef.close(publicacion);
      },
      error: (error: HttpErrorResponse) => {
        this.cargando.set(false);
        this.errorMensaje.set(this.interpretarError(error));
      },
    });
  }

  private armarRequest(): CrearPublicacion {
    const valores = this.form.getRawValue();

    const caracteristicas = [
      { codRasgo: valores.especie!.codRasgo, nroValorDominio: valores.especie!.nroValorDominio },
    ];
    if (valores.raza) {
      caracteristicas.push({ codRasgo: valores.raza.codRasgo, nroValorDominio: valores.raza.nroValorDominio });
    }

    return {
      mascota: {
        nombre: valores.nombre,
        sexo: valores.sexo,
        anioNacimiento: valores.anioNacimiento,
        caracteristicas,
      },
      caracteristicasMascota: valores.caracteristicasMascota,
      condicionAdopcion: valores.condicionAdopcion,
      foto: this.fotoBase64,
    };
  }

  private interpretarError(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Probá de nuevo en unos minutos.';
    }
    if (error.status === 409) {
      return 'Esa mascota ya tiene una publicación de adopción activa.';
    }
    if (error.status === 400) {
      return 'Revisá los datos ingresados: hay campos incompletos o incorrectos.';
    }
    return 'Ocurrió un error inesperado. Probá de nuevo.';
  }
}
