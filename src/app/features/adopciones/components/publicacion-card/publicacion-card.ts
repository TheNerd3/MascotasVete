import { Component, DestroyRef, computed, effect, inject, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AccionPublicacion, PublicacionAdopcion } from '../../interfaces/publicacion-adopcion.model';
import { PublicacionesResource } from '../../services/publicaciones-resource';

/**
 * Tarjeta de una publicación de adopción. Los botones de acción salen
 * de accionesDisponibles (lo que manda el backend según el estado
 * actual, RF13): el frontend no reimplementa la máquina de estados.
 * Si la publicación tiene foto (fotoExiste), se pide una sola vez por
 * nroPublicacion como blob (la ruta exige Authorization, que un
 * <img src> no manda) y se arma una URL de objeto para mostrarla; si
 * no, se muestra un ícono de mascota como placeholder.
 *
 *   <app-publicacion-card [publicacion]="p" (accion)="onAccion($event)" />
 */
@Component({
  selector: 'app-publicacion-card',
  imports: [MatIconModule],
  templateUrl: './publicacion-card.html',
  styleUrl: './publicacion-card.scss',
})
export class PublicacionCard {
  private readonly publicacionesResource = inject(PublicacionesResource);
  private readonly destroyRef = inject(DestroyRef);

  readonly publicacion = input.required<PublicacionAdopcion>();

  readonly accion = output<{ publicacion: PublicacionAdopcion; accion: AccionPublicacion }>();

  protected readonly fotoUrl = signal<string | null>(null);

  private nroPublicacionConFotoPedida: number | null = null;
  private urlDeObjetoActual: string | null = null;

  constructor() {
    // Se dispara solo cuando cambia nroPublicacion (no en cada
    // re-render del padre con el mismo dato), y solo pide la foto una
    // vez por publicación, para no repetir la petición de más.
    effect(() => {
      const publicacionActual = this.publicacion();

      if (!publicacionActual.fotoExiste) {
        this.limpiarUrlDeObjeto();
        this.nroPublicacionConFotoPedida = null;
        return;
      }

      if (this.nroPublicacionConFotoPedida === publicacionActual.nroPublicacion) {
        return;
      }

      this.nroPublicacionConFotoPedida = publicacionActual.nroPublicacion;
      this.publicacionesResource.obtenerFotoPropia(publicacionActual.nroPublicacion).subscribe((blob) => {
        this.limpiarUrlDeObjeto();
        this.urlDeObjetoActual = URL.createObjectURL(blob);
        this.fotoUrl.set(this.urlDeObjetoActual);
      });
    });

    this.destroyRef.onDestroy(() => this.limpiarUrlDeObjeto());
  }

  private limpiarUrlDeObjeto(): void {
    if (this.urlDeObjetoActual) {
      URL.revokeObjectURL(this.urlDeObjetoActual);
      this.urlDeObjetoActual = null;
    }
    this.fotoUrl.set(null);
  }

  protected readonly edadTexto = computed(() => {
    const anio = this.publicacion().anioNacimientoMascota;
    if (!anio) {
      return 'Edad desconocida';
    }
    const edad = new Date().getFullYear() - anio;
    return edad === 1 ? '1 año' : `${edad} años`;
  });

  protected readonly sexoTexto = computed(() => (this.publicacion().sexoMascota === 'M' ? 'Macho' : 'Hembra'));

  protected readonly especieYRaza = computed(() => {
    const { especieMascota, razaMascota } = this.publicacion();
    return [especieMascota, razaMascota].filter((valor) => !!valor).join(' · ');
  });

  private static readonly ETIQUETAS: Record<AccionPublicacion, string> = {
    ACTIVAR: 'Reactivar publicación',
    PAUSAR: 'Pausar publicación',
    FINALIZAR: 'Finalizar publicación',
  };

  private static readonly ICONOS: Record<AccionPublicacion, string> = {
    ACTIVAR: 'play_arrow',
    PAUSAR: 'pause',
    FINALIZAR: 'flag',
  };

  protected etiquetaDe(accion: AccionPublicacion): string {
    return PublicacionCard.ETIQUETAS[accion];
  }

  protected iconoDe(accion: AccionPublicacion): string {
    return PublicacionCard.ICONOS[accion];
  }

  protected onAccion(accion: AccionPublicacion): void {
    this.accion.emit({ publicacion: this.publicacion(), accion });
  }
}
