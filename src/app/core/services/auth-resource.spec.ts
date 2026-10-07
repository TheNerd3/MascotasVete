import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthResource } from './auth-resource';
import { environment } from '../../../environments/environment';

function crearJwtDeFantasia(payload: Record<string, unknown>): string {
  const encabezado = btoa(JSON.stringify({ alg: 'none' }));
  const cuerpo = btoa(JSON.stringify(payload));
  return `${encabezado}.${cuerpo}.firma-simulada`;
}

describe('AuthResource', () => {
  let servicio: AuthResource;
  let backendSimulado: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    servicio = TestBed.inject(AuthResource);
    backendSimulado = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    backendSimulado.verify();
    localStorage.clear();
  });

  it('al iniciar sesión correctamente, guarda el token y los datos del usuario', () => {
    const expiracionFutura = Math.floor(Date.now() / 1000) + 3600;
    const token = crearJwtDeFantasia({
      sub: '20123456789',
      idCiudadano: 1,
      perfil: 'CIUDADANO',
      exp: expiracionFutura,
    });

    servicio.login({ cuil: '20123456789', clave: 'claveSegura123' }).subscribe();

    const peticion = backendSimulado.expectOne(`${environment.apiUrl}/auth/login`);
    expect(peticion.request.method).toBe('POST');
    expect(peticion.request.body).toEqual({ cuil: '20123456789', clave: 'claveSegura123' });

    peticion.flush({
      token,
      idCiudadano: 1,
      nombre: 'Ana',
      apellido: 'Perez',
      perfil: 'CIUDADANO',
      idRefugio: null,
      idVeterinaria: null,
    });

    expect(servicio.obtenerToken()).toBe(token);
    expect(servicio.estaAutenticado()).toBe(true);
    expect(servicio.usuario()?.nombre).toBe('Ana');
    expect(servicio.usuario()?.perfil).toBe('CIUDADANO');
  });

  it('al iniciar sesión como refugio, guarda el idRefugio', () => {
    const token = crearJwtDeFantasia({
      sub: '20345678906',
      idCiudadano: 27,
      perfil: 'REFUGIO',
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    servicio.login({ cuil: '20345678906', clave: 'claveSegura123' }).subscribe();

    backendSimulado.expectOne(`${environment.apiUrl}/auth/login`).flush({
      token,
      idCiudadano: 27,
      nombre: 'Marcos',
      apellido: 'Diaz',
      perfil: 'REFUGIO',
      idRefugio: 10,
      idVeterinaria: null,
    });

    expect(servicio.usuario()?.perfil).toBe('REFUGIO');
    expect(servicio.usuario()?.idRefugio).toBe(10);
  });

  it('logout borra el token y la sesión activa', () => {
    const token = crearJwtDeFantasia({
      sub: '20123456789',
      idCiudadano: 1,
      perfil: 'CIUDADANO',
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    servicio.login({ cuil: '20123456789', clave: 'claveSegura123' }).subscribe();
    backendSimulado.expectOne(`${environment.apiUrl}/auth/login`).flush({
      token,
      idCiudadano: 1,
      nombre: 'Ana',
      apellido: 'Perez',
      perfil: 'CIUDADANO',
      idRefugio: null,
      idVeterinaria: null,
    });

    expect(servicio.estaAutenticado()).toBe(true);

    servicio.logout();

    expect(servicio.obtenerToken()).toBeNull();
    expect(servicio.usuario()).toBeNull();
    expect(servicio.estaAutenticado()).toBe(false);
  });

  it('sin sesión iniciada, estaAutenticado es false', () => {
    expect(servicio.estaAutenticado()).toBe(false);
    expect(servicio.usuario()).toBeNull();
  });
});
