import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div style="text-align:center; margin-top: 48px;">
      <h1>Bem-vindo ao SisKitnet!</h1>
      <p style="font-size: 1.2rem; color: #666;">Esta é a página inicial do sistema.</p>
      <mat-icon style="font-size: 64px; color: #1976d2;">home</mat-icon>
    </div>
  `
})
export class HomeComponent {}
