import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acesso-negado',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './acesso-negado.component.html',
  styleUrl: './acesso-negado.component.scss'
})
export class AcessoNegadoComponent {

  constructor(private router: Router) {}
  
  voltarLogin() {
    this.router.navigate(['/login']);
  }
}
