# Mascotas Córdoba - Frontend

Frontend en Angular 22 (standalone components, signals, SSR) para la
plataforma municipal "Mascotas Córdoba". Consume la API REST del backend
en [MascotasVeteBack](https://github.com/TheNerd3/MascotasVeteBack).

## Stack

- Angular 22 (standalone, sin NgModules), zoneless change detection
- Angular Material (Material 3, tema propio en verde)
- SSR con `@angular/ssr` (hidratación con event replay)
- Signals para estado (sin librería de estado externa)
- SCSS con design tokens y breakpoints propios en `src/styles/`

## Estructura de carpetas

```
src/app/
 ├── core/          # singletons: servicios, guards, interceptors, modelos base
 │   ├── services/    (AuthService, TokenStorageService)
 │   ├── guards/       (authGuard, perfilGuard)
 │   ├── interceptors/ (auth, manejo de errores HTTP)
 │   ├── models/       (Perfil, UsuarioAutenticado, ApiError)
 │   └── utils/        (decodificación de JWT)
 ├── shared/        # reutilizable entre features, sin lógica de negocio
 │   └── components/  (BrandHeader, AuthCard, IconInput, PrimaryButton, EnConstruccion)
 ├── layout/        # shells visuales (no son features de negocio)
 │   ├── main-layout/  (navegación completa)
 │   └── auth-layout/  (minimal, para login/registro)
 └── features/      # un directorio por dominio, cada uno lazy-loaded
     ├── auth/
     ├── ciudadanos/
     ├── mascotas/
     ├── veterinarias/
     ├── refugios/
     ├── adopciones/
     ├── carnet-sanitario/
     ├── asistente-virtual/
     └── home/
```

Cada feature sigue el mismo patrón interno: `pages/` (componentes de
ruta), `services/` (HTTP hacia el backend), `models/` (interfaces del
dominio), y opcionalmente `components/` para piezas de UI propias de esa
feature que no ameritan estar en `shared/`.

### Por qué esta estructura

- **Escalable**: cada feature nueva se agrega sin tocar las existentes;
  todas se cargan con `loadChildren`/`loadComponent`, así el bundle
  inicial no crece a medida que se suman secciones.
- **`core` vs `shared`**: `core` son servicios con estado o lógica
  transversal que existen una sola vez en toda la app (auth, guards);
  `shared` son piezas de UI sin estado propio, reutilizables en
  cualquier feature.
- **Componentes reutilizables**: antes de escribir un formulario nuevo,
  revisar `shared/components/` (`IconInput`, `PrimaryButton`,
  `AuthCard`, `BrandHeader`) — implementan `ControlValueAccessor` donde
  corresponde para integrarse con Reactive Forms igual que un `<input>`
  nativo.

## Adaptabilidad (responsive)

Los breakpoints están centralizados en `src/styles/_breakpoints.scss`
(mobile-first, con mixins `desde-sm`/`desde-md`/`desde-lg`/`desde-xl`).
Cualquier componente los usa así:

```scss
@use 'breakpoints' as bp;

.mi-componente {
  padding: var(--app-spacing-sm);

  @include bp.desde-md {
    padding: var(--app-spacing-lg);
  }
}
```

Los espaciados, radios y sombras también están centralizados como CSS
custom properties (`--app-spacing-*`, `--app-radius-*`,
`--app-shadow-card`) definidas en `src/styles.scss`, para que todo el
sistema visual escale desde un único lugar.

## Variables de entorno

La URL de la API se configura en `src/environments/`:

- `environment.development.ts`: `http://localhost:8080/api` (backend local)
- `environment.production.ts`: `/api` (se espera un proxy/reverse-proxy
  en producción; ajustar según el esquema de deploy real)

## Desarrollo

```bash
npm install
npm start          # ng serve, http://localhost:4200
npm run build       # build de producción (browser + server bundles)
npm test            # tests unitarios (Vitest)
```

## Autenticación

El backend expone `POST /api/auth/login` (RF15) devolviendo un JWT. El
token se guarda en `localStorage` a través de `TokenStorageService`
(aislado ahí porque `localStorage` no existe en el render del lado del
servidor). `AuthService` mantiene el usuario autenticado como signal, y
`authInterceptor`/`errorInterceptor` se encargan de adjuntar el token a
cada request y de cerrar sesión automáticamente ante un 401.
