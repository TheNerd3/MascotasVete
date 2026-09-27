import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Página de inicio, con accesos rápidos a las secciones principales de
 * la plataforma (registrar mascota, ver adopciones, ver veterinarias).
 */
@Component({
  selector: 'app-home-page',
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {}
