
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './core/layout/layout.component';
import { HttpClientModule } from "@angular/common/http";
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    LayoutComponent,
    HttpClientModule,
    RouterOutlet
  ],
  providers: [
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(public router: Router) {}
  title = 'sis-kitnet';
  get isLoginRoute() {
    return this.router.url.startsWith('/login');
  }
}
