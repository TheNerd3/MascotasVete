import { Component } from '@angular/core';

/**
 * Tarjeta blanca centrada que sirve de base visual para las pantallas
 * de login y registro. Lo que se pone adentro (formulario, textos) lo
 * decide cada pantalla, esta tarjeta solo da el marco.
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
