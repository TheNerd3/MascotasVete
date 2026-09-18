import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UsuarioAutenticado } from '../models';
import { TokenStorageService } from './token-storage.service';
import { decodificarPayloadJwt, jwtExpirado } from '../utils/jwt.util';

interface LoginRequest {
  cuil: string;
  clave: string;
}

interface CiudadanoResponse {
  idCiudadano: number;
  apellido: string;
  nombre: string;
  cuil: string;
  correo: string | null;
  telefono: string | null;
  domicilio: string | null;
  habilitado: boolean;
}

interface LoginResponse {
  token: string;
  tipo: string;
  ciudadano: CiudadanoResponse;
  perfil: UsuarioAutenticado['perfil'];
}

/**
 * Autenticacion contra el backend (RF15). Mantiene el estado de sesion
 * en signals para que cualquier componente/guard pueda reaccionar sin
 * suscribirse a un Observable a mano.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);

  private readonly usuarioSignal = signal<UsuarioAutenticado | null>(this.restaurarSesion());

  readonly usuario = this.usuarioSignal.asReadonly();
  readonly estaAutenticado = computed(() => this.usuarioSignal() !== null);

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, request).pipe(
      tap((respuesta) => {
        this.tokenStorage.guardar(respuesta.token);
        this.usuarioSignal.set({
          idCiudadano: respuesta.ciudadano.idCiudadano,
          cuil: respuesta.ciudadano.cuil,
          nombre: respuesta.ciudadano.nombre,
          apellido: respuesta.ciudadano.apellido,
          perfil: respuesta.perfil,
        });
      }),
    );
  }

  logout(): void {
    this.tokenStorage.limpiar();
    this.usuarioSignal.set(null);
  }

  obtenerToken(): string | null {
    return this.tokenStorage.obtener();
  }

  private restaurarSesion(): UsuarioAutenticado | null {
    const token = this.tokenStorage.obtener();
    if (!token || jwtExpirado(token)) {
      return null;
    }

    const payload = decodificarPayloadJwt<{
      sub: string;
      idCiudadano: number;
      perfil: UsuarioAutenticado['perfil'];
    }>(token);

    if (!payload) {
      return null;
    }

    // El JWT no trae nombre/apellido (solo cuil, idCiudadano, perfil):
    // se completan en blanco hasta que un GET /api/ciudadanos/{id} los
    // traiga (ver CiudadanoService), evitando decodificar datos que no
    // estan en el token.
    return {
      idCiudadano: payload.idCiudadano,
      cuil: payload.sub,
      perfil: payload.perfil,
      nombre: '',
      apellido: '',
    };
  }
}
