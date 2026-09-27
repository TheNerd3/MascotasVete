import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Estructura simple para la pantalla de login, sin la barra de
 * navegación completa: todavía no hay un ciudadano identificado.
 */
@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {}
