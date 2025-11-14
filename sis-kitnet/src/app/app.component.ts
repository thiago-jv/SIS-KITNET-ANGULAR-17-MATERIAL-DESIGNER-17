import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BreakpointObserver } from '@angular/cdk/layout';

import { CommonModule } from '@angular/common';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  isMobile = false;

  constructor(private breakpoints: BreakpointObserver) {
    this.breakpoints
      .observe(['(max-width: 768px)'])
      .subscribe(result => this.isMobile = result.matches);
  }
}
