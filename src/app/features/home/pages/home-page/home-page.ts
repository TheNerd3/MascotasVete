import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {}
