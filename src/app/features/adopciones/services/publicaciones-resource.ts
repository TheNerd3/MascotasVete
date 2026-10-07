import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  AccionPublicacion,
  CrearPublicacion,
  EstadoPublicacion,
  PaginaPublicaciones,
  PublicacionAdopcion,
  ValorCatalogo,
} from '../models/publicacion-adopcion.model';

/**
 * RF13 - Publicaciones de adopción del refugio autenticado. Expone
 * GET/POST/PATCH /publicaciones y los catálogos de especie/raza para
 * el formulario de alta.
 */
@Injectable({ providedIn: 'root' })
export class PublicacionesResource {
  private readonly http = inject(HttpClient);

  listarMisPublicaciones(estado?: EstadoPublicacion): Observable<PaginaPublicaciones> {
    let params = new HttpParams();
    if (estado) {
      params = params.set('estado', estado);
    }

    return this.http.get<PaginaPublicaciones>(`${environment.apiUrl}/publicaciones`, { params });
  }

  crear(request: CrearPublicacion): Observable<PublicacionAdopcion> {
    return this.http.post<PublicacionAdopcion>(`${environment.apiUrl}/publicaciones`, request);
  }

  cambiarEstado(nroPublicacion: number, accion: AccionPublicacion): Observable<PublicacionAdopcion> {
    return this.http.patch<PublicacionAdopcion>(`${environment.apiUrl}/publicaciones/${nroPublicacion}/estado`, {
      accion,
    });
  }

  listarEspecies(): Observable<ValorCatalogo[]> {
    return this.http.get<ValorCatalogo[]>(`${environment.apiUrl}/catalogos/especies`);
  }

  listarRazas(): Observable<ValorCatalogo[]> {
    return this.http.get<ValorCatalogo[]>(`${environment.apiUrl}/catalogos/razas`);
  }
}
