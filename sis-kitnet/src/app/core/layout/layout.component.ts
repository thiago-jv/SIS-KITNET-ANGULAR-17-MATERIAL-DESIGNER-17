import { Component, OnDestroy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MenuComponent } from '../menu/menu.component';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MenuComponent,
    RouterOutlet,
    MatDividerModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnDestroy {

  //Controle de expansão do menu
  expandedGroup: string | null = null;

  toggleGroup(group: string) {
    this.expandedGroup = this.expandedGroup === group ? null : group;
  }

  //Responsividade
  isMobile = false;

  //Usuário
  userEmail: string | null = null;
  userPermissions: string[] = [];
  groupedPermissions: { group: string, perms: string[] }[] = [];

  //Subscription
  private authSub = this.auth.authChanged$.subscribe(payload => {
    this.userEmail = payload?.email || null;
    this.userPermissions = payload?.permissions || [];
    this.groupedPermissions = this.groupPerms(this.userPermissions);
  });

  constructor(
    private breakpoints: BreakpointObserver,
    public auth: AuthService,
    private router: Router
  ) {
    // Responsividade
    this.breakpoints
      .observe(['(max-width: 768px)'])
      .subscribe(result => this.isMobile = result.matches);

    // Inicialização do usuário
    const payload = this.auth.jwtPayloadPublic;
    this.userEmail = payload?.email || null;
    this.userPermissions = payload?.permissions || [];
    this.groupedPermissions = this.groupPerms(this.userPermissions);
  }

  //Agrupa permissões
  groupPerms(perms: string[]): { group: string, perms: string[] }[] {
    const map: { [key: string]: string[] } = {};

    for (const perm of perms) {
      const match = perm.match(/^PERM_([A-Z_]+?)_/);
      const group = match ? match[1] : 'OUTROS';

      if (!map[group]) map[group] = [];
      map[group].push(perm);
    }

    return Object.entries(map).map(([group, perms]) => ({ group, perms }));
  }

  //Cleanup
  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  //Logout
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
  
}