import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Ciudadano, RegistrarCiudadanoRequest } from '../models/ciudadano.model';

@Injectable({ providedIn: 'root' })
export class CiudadanosService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/ciudadanos`;

  registrar(request: RegistrarCiudadanoRequest): Observable<Ciudadano> {
    return this.http.post<Ciudadano>(this.baseUrl, request);
  }

  buscarPorId(id: number): Observable<Ciudadano> {
    return this.http.get<Ciudadano>(`${this.baseUrl}/${id}`);
  }
}
