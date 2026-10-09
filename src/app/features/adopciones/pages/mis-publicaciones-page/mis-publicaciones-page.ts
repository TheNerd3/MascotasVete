import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { PublicacionCard } from '../../components/publicacion-card/publicacion-card';
import { NuevaPublicacionDialog } from '../../components/nueva-publicacion-dialog/nueva-publicacion-dialog';
import { AccionPublicacion, EstadoPublicacion, PublicacionAdopcion } from '../../interfaces/publicacion-adopcion.model';
import { PublicacionesResource } from '../../services/publicaciones-resource';
import { IconInput, PrimaryButton } from '../../../../shared/components';

type FiltroEstado = EstadoPublicacion | 'Todos';

/**
 * RF13 - Publicaciones de adopción del refugio logueado: listado con
 * búsqueda por nombre (client-side, sobre la página cargada) y filtro
 * por estado (server-side, vía GET /publicaciones?estado=).
 */
@Component({
  selector: 'app-mis-publicaciones-page',
  imports: [FormsModule, MatFormFieldModule, MatSelectModule, PublicacionCard, IconInput, PrimaryButton],
  templateUrl: './mis-publicaciones-page.html',
  styleUrl: './mis-publicaciones-page.scss',
})
export class MisPublicacionesPage implements OnInit {
  private readonly publicacionesResource = inject(PublicacionesResource);
  private readonly dialog = inject(MatDialog);

  protected readonly estadosDisponibles: FiltroEstado[] = ['Todos', 'Activa', 'Pausada', 'Finalizada'];

  protected readonly busqueda = signal('');
  protected readonly estado = signal<FiltroEstado>('Todos');
  protected readonly cargando = signal(false);

  private readonly publicaciones = signal<PublicacionAdopcion[]>([]);

  protected readonly publicacionesFiltradas = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();

    return this.publicaciones().filter((publicacion) => {
      return !texto || publicacion.nombreMascota.toLowerCase().includes(texto);
    });
  });

  ngOnInit(): void {
    this.cargar();
  }

  protected cambiarEstado(nuevoEstado: FiltroEstado): void {
    this.estado.set(nuevoEstado);
    this.cargar();
  }

  protected abrirNuevaPublicacion(): void {
    const referencia = this.dialog.open(NuevaPublicacionDialog);

    referencia.afterClosed().subscribe((publicacionCreada: PublicacionAdopcion | undefined) => {
      if (publicacionCreada) {
        this.cargar();
      }
    });
  }

  protected onAccion(evento: { publicacion: PublicacionAdopcion; accion: AccionPublicacion }): void {
    this.publicacionesResource.cambiarEstado(evento.publicacion.nroPublicacion, evento.accion).subscribe(() => {
      this.cargar();
    });
  }

  private cargar(): void {
    this.cargando.set(true);
    const estadoElegido = this.estado();
    const filtro = estadoElegido === 'Todos' ? undefined : estadoElegido;

    this.publicacionesResource.listarMisPublicaciones(filtro).subscribe({
      next: (pagina) => {
        this.publicaciones.set(pagina.content);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }
}
