import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Ciudadano } from '../models/ciudadano.model';

/**
 * Consulta de datos de ciudadanos contra el backend. La usa cualquier
 * pantalla que necesite mostrar los datos completos del ciudadano
 * logueado (RF20).
 */
@Injectable({ providedIn: 'root' })
export class CiudadanosService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/ciudadanos`;

  buscarPorId(id: number): Observable<Ciudadano> {
    return this.http.get<Ciudadano>(`${this.baseUrl}/${id}`);
  }
}
