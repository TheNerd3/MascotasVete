import { Component } from '@angular/core';

/**
 * Contenedor de tarjeta blanca centrada, con sombra suave y ancho
 * maximo, usado como base visual de las pantallas de autenticacion
 * (login, registro). El contenido real se proyecta con <ng-content>,
 * asi cada pantalla arma su propio formulario adentro.
 */
@Component({
  selector: 'app-auth-card',
  template: `
    <div class="auth-card">
      <ng-content />
    </div>
  `,
  styleUrl: './auth-card.scss',
})
export class AuthCard {}
