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
  cuil: string;
  clave: string;
}

interface LoginResponse {
  token: string;
  idCiudadano: number;
  nombre: string;
  apellido: string;
  perfil: UsuarioAutenticado['perfil'];
  idRefugio: number | null;
  idVeterinaria: number | null;
}

/**
 * Autentica ciudadanos contra el backend y mantiene la sesión activa.
 * Implementa RF15. El backend simula CiDi validando contra
 * ciudadanos.cuil y ciudadanos.clave; esta clase no sabe eso, solo
 * consume POST /auth/login.
 */
@Injectable({ providedIn: 'root' })
export class AuthResource {
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
    const request: LoginRequest = { cuil: formulario.cuil, clave: formulario.clave };

    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, request).pipe(
      tap((respuesta) => {
        this.tokenStorage.guardar(respuesta.token);

        this.usuarioSignal.set({
          idCiudadano: respuesta.idCiudadano,
          cuil: formulario.cuil,
          nombre: respuesta.nombre,
          apellido: respuesta.apellido,
          perfil: respuesta.perfil,
          idRefugio: respuesta.idRefugio,
          idVeterinaria: respuesta.idVeterinaria,
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
      idRefugio?: number;
    }>(token);

    if (!payload) {
      return null;
    }

    // El token trae idRefugio como claim (solo si el perfil es
    // REFUGIO), pero no nombre, apellido ni idVeterinaria: quedan
    // vacíos/null hasta que la pantalla que los necesite los pida con
    // el servicio que corresponda.
    return {
      idCiudadano: payload.idCiudadano,
      cuil: payload.sub,
      perfil: payload.perfil,
      nombre: '',
      apellido: '',
      idRefugio: payload.idRefugio ?? null,
      idVeterinaria: null,
    };
  }
}
