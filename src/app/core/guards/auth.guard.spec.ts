import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { authGuard } from './auth.guard';
import { AuthResource } from '../services/auth-resource';

describe('authGuard', () => {
  let router: Router;

  function ejecutarGuard(): boolean | UrlTree {
    return TestBed.runInInjectionContext(() =>
      authGuard({} as never, {} as never),
    ) as boolean | UrlTree;
  }

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    router = TestBed.inject(Router);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('sin sesión iniciada, redirige al login', () => {
    const resultado = ejecutarGuard();

    expect(resultado).not.toBe(true);
    expect((resultado as UrlTree).toString()).toBe(router.createUrlTree(['/auth/login']).toString());
  });

  it('con sesión iniciada, deja pasar', () => {
    const authResource = TestBed.inject(AuthResource);
    simularSesionActiva(authResource);

    const resultado = ejecutarGuard();

    expect(resultado).toBe(true);
  });

  function simularSesionActiva(authResource: AuthResource): void {
    Object.defineProperty(authResource, 'estaAutenticado', {
      value: () => true,
    });
  }
});
