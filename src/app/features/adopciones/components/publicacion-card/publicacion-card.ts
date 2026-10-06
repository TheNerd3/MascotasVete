import { Component, computed, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PublicacionAdopcion } from '../../models/publicacion-adopcion.model';

/**
 * Tarjeta de una publicación de adopción, con sus acciones de gestión
 * (pausar/reactivar, eliminar). El backend no devuelve foto en el
 * listado, así que se muestra un ícono de mascota como placeholder.
 *
 *   <app-publicacion-card [publicacion]="p" (pausar)="onPausar($event)" (eliminar)="onEliminar($event)" />
 */
@Component({
  selector: 'app-publicacion-card',
  imports: [MatIconModule],
  templateUrl: './publicacion-card.html',
  styleUrl: './publicacion-card.scss',
})
export class PublicacionCard {
  readonly publicacion = input.required<PublicacionAdopcion>();

  readonly pausar = output<PublicacionAdopcion>();
  readonly eliminar = output<PublicacionAdopcion>();

  protected readonly edadTexto = computed(() => {
    const anio = this.publicacion().anioNacimientoMascota;
    if (!anio) {
      return 'Edad desconocida';
    }
    const edad = new Date().getFullYear() - anio;
    return edad === 1 ? '1 año' : `${edad} años`;
  });

  protected readonly sexoTexto = computed(() => (this.publicacion().sexoMascota === 'M' ? 'Macho' : 'Hembra'));

  protected readonly accionPausarTexto = computed(() =>
    this.publicacion().estadoPublicacion === 'Activa' ? 'Pausar publicación' : 'Reactivar publicación',
  );

  protected readonly accionPausarIcono = computed(() =>
    this.publicacion().estadoPublicacion === 'Activa' ? 'pause' : 'play_arrow',
  );

  protected onPausar(): void {
    this.pausar.emit(this.publicacion());
  }

  protected onEliminar(): void {
    this.eliminar.emit(this.publicacion());
  }
}
