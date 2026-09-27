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
 * Autentica ciudadanos contra el backend y mantiene la sesión activa.
 * Implementa RF15. El backend simula CiDi validando contra
 * ciudadanos.cuil y ciudadanos.clave; esta clase no sabe eso, solo
 * consume POST /api/auth/login.
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

    // El token no trae nombre ni apellido, solo cuil, idCiudadano y perfil.
    // Quedan vacíos hasta que la pantalla que los necesite los pida con
    // CiudadanosService.
    return {
      idCiudadano: payload.idCiudadano,
      cuil: payload.sub,
      perfil: payload.perfil,
      nombre: '',
      apellido: '',
    };
  }
}
