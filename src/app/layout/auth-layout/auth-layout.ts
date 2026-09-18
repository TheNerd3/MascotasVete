import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Layout minimal (sin toolbar de navegacion completa) para las paginas
 * de autenticacion: login y registro de ciudadano. El branding se
 * muestra dentro de cada pagina via <app-brand-header>, no aca, para
 * que cada pagina controle su propio encabezado dentro de la tarjeta.
 */
@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {}
