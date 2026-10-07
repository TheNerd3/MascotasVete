import { Component, computed, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AccionPublicacion, PublicacionAdopcion } from '../../models/publicacion-adopcion.model';

/**
 * Tarjeta de una publicación de adopción. Los botones de acción salen
 * de accionesDisponibles (lo que manda el backend según el estado
 * actual, RF13): el frontend no reimplementa la máquina de estados.
 * El backend no devuelve foto en el listado, así que se muestra un
 * ícono de mascota como placeholder.
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
  readonly publicacion = input.required<PublicacionAdopcion>();

  readonly accion = output<{ publicacion: PublicacionAdopcion; accion: AccionPublicacion }>();

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
