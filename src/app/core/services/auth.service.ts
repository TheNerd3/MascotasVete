import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UsuarioAutenticado } from '../models';
import { TokenStorageService } from './token-storage.service';
import { decodificarPayloadJwt, jwtExpirado } from '../utils/jwt.util';

interface LoginFormulario {
  cuil: string;
  clave: string;
}

interface LoginRequest {
  usuario: string;
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
  expiraEn: number;
  usuario: CiudadanoResponse;
}

/**
 * Autentica ciudadanos contra el backend y mantiene la sesión activa.
 * Implementa RF15. El backend simula CiDi validando contra
 * ciudadanos.cuil y ciudadanos.clave; esta clase no sabe eso, solo
 * consume POST /auth/login.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);

  private readonly usuarioSignal = signal<UsuarioAutenticado | null>(this.restaurarSesion());

  readonly usuario = this.usuarioSignal.asReadonly();
  readonly estaAutenticado = computed(() => {
    const usuario = this.usuarioSignal();
    if (!usuario) {
      return false;
    }
    const token = this.tokenStorage.obtener();
    return !!token && !jwtExpirado(token);
  });

  login(formulario: LoginFormulario): Observable<LoginResponse> {
    const request: LoginRequest = { usuario: formulario.cuil, clave: formulario.clave };

    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, request).pipe(
      tap((respuesta) => {
        this.tokenStorage.guardar(respuesta.token);

        const payload = decodificarPayloadJwt<{ perfil: UsuarioAutenticado['perfil'] }>(respuesta.token);

        this.usuarioSignal.set({
          idCiudadano: respuesta.usuario.idCiudadano,
          cuil: respuesta.usuario.cuil,
          nombre: respuesta.usuario.nombre,
          apellido: respuesta.usuario.apellido,
          perfil: payload!.perfil,
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
