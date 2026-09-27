import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../core/services/auth.service';

/**
 * Estructura general de la aplicación (barra de navegación superior +
 * contenido de la página). Muestra opciones distintas según si hay un
 * ciudadano logueado o no.
 */
@Component({
  selector: 'app-main-layout',
  imports: [RouterLink, RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly usuario = this.authService.usuario;
  readonly nombreUsuario = computed(() => {
    const usuario = this.usuario();
    return usuario ? `${usuario.nombre} ${usuario.apellido}`.trim() || usuario.cuil : '';
  });

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
