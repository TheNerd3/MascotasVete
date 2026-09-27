import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Componente raíz: solo aloja la pantalla que corresponda según la ruta. */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
