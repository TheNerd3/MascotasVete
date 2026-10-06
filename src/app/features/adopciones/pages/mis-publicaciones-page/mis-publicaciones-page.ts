import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { PublicacionCard } from '../../components/publicacion-card/publicacion-card';
import { EstadoPublicacion, PublicacionAdopcion } from '../../models/publicacion-adopcion.model';
import { IconInput, PrimaryButton } from '../../../../shared/components';

type FiltroEstado = EstadoPublicacion | 'Todos';

/**
 * RF13 - Publicaciones de adopción del refugio logueado: listado con
 * búsqueda por nombre y filtro por estado.
 */
@Component({
  selector: 'app-mis-publicaciones-page',
  imports: [FormsModule, MatFormFieldModule, MatSelectModule, PublicacionCard, IconInput, PrimaryButton],
  templateUrl: './mis-publicaciones-page.html',
  styleUrl: './mis-publicaciones-page.scss',
})
export class MisPublicacionesPage {
  protected readonly estadosDisponibles: FiltroEstado[] = ['Todos', 'Activa', 'Pausada', 'Finalizada'];

  protected readonly busqueda = signal('');
  protected readonly estado = signal<FiltroEstado>('Todos');

  // Parte 3: datos de prueba para revisar el filtrado y la búsqueda.
  // Se reemplazan por el listado real del backend en la Parte 4.
  private readonly publicacionesMock = signal<PublicacionAdopcion[]>([
    {
      nroPublicacion: 1,
      nroRegMunicipal: 125,
      nombreMascota: 'Mora',
      sexoMascota: 'H',
      anioNacimientoMascota: new Date().getFullYear() - 2,
      idRefugio: 10,
      fechaPublicacion: '2026-09-01',
      caracteristicasMascota:
        'Mora es una perrita cariñosa, tranquila y sociable. Busca una familia responsable que pueda brindarle mucho amor.',
      condicionAdopcion: null,
      estadoPublicacion: 'Activa',
    },
    {
      nroPublicacion: 2,
      nroRegMunicipal: 131,
      nombreMascota: 'Toby',
      sexoMascota: 'M',
      anioNacimientoMascota: new Date().getFullYear() - 4,
      idRefugio: 10,
      fechaPublicacion: '2026-08-15',
      caracteristicasMascota: 'Toby es muy juguetón y energético. Se lleva bien con otros perros y disfruta mucho de los paseos.',
      condicionAdopcion: null,
      estadoPublicacion: 'Activa',
    },
    {
      nroPublicacion: 3,
      nroRegMunicipal: 145,
      nombreMascota: 'Luna',
      sexoMascota: 'H',
      anioNacimientoMascota: new Date().getFullYear() - 1,
      idRefugio: 10,
      fechaPublicacion: '2026-07-20',
      caracteristicasMascota: 'Luna es una gatita tranquila y muy cariñosa. Actualmente se encuentra en evaluación para adopción.',
      condicionAdopcion: null,
      estadoPublicacion: 'Pausada',
    },
  ]);

  protected readonly publicacionesFiltradas = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const estadoElegido = this.estado();

    return this.publicacionesMock().filter((publicacion) => {
      const coincideTexto = !texto || publicacion.nombreMascota.toLowerCase().includes(texto);
      const coincideEstado = estadoElegido === 'Todos' || publicacion.estadoPublicacion === estadoElegido;
      return coincideTexto && coincideEstado;
    });
  });

  protected pausar(publicacion: PublicacionAdopcion): void {
    const nuevoEstado: EstadoPublicacion = publicacion.estadoPublicacion === 'Activa' ? 'Pausada' : 'Activa';

    this.publicacionesMock.update((lista) =>
      lista.map((item) => (item.nroPublicacion === publicacion.nroPublicacion ? { ...item, estadoPublicacion: nuevoEstado } : item)),
    );
  }

  protected eliminar(publicacion: PublicacionAdopcion): void {
    this.publicacionesMock.update((lista) => lista.filter((item) => item.nroPublicacion !== publicacion.nroPublicacion));
  }
}
