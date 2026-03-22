import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  exact?: boolean;
  permission?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
    MatTooltipModule
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnDestroy {
  isAuthenticated = false;
  private authSub;

  constructor(public auth: AuthService) {
    this.authSub = this.auth.authChanged$.subscribe(payload => {
      this.isAuthenticated = !!payload;
    });
    this.isAuthenticated = !!this.auth.jwtPayloadPublic;
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  readonly menuSections: MenuSection[] = [
    {
      title: 'Principal',
      items: [
        { label: 'Indicadores', icon: 'dashboard', route: '/indicadores', exact: true },
        { label: 'Locação', icon: 'home_work', route: '/controle-lancamento', exact: true, permission: 'PERM_LANCAMENTO_LIST' }
      ]
    },
    {
      title: 'Cadastros',
      items: [
        { label: 'Apartamento', icon: 'apartment', route: '/apartamento', exact: true, permission: 'PERM_APARTAMENTO_LIST' },
        { label: 'Prédio', icon: 'location_city', route: '/predio', exact: true, permission: 'PERM_PREDIO_LIST' },
        { label: 'Inquilino', icon: 'person_add', route: '/inquilino', exact: true, permission: 'PERM_INQUILINO_LIST' },
        { label: 'Valor', icon: 'attach_money', route: '/valor', exact: true, permission: 'PERM_VALOR_LIST' },
        { label: 'Movimento Financeiro', icon: 'account_balance_wallet', route: '/movimento-financeiro', exact: true, permission: 'PERM_MOVIMENTO_FINANCEIRO_LIST' }
      ]
    },
    {
      title: 'Relatórios',
      items: [
        { label: 'Relatório Gerencial', icon: 'assignment', route: '/relatorio-gerencial', exact: true }
      ]
    },
    {
      title: 'Sistema',
      items: [
        { label: 'Usuário', icon: 'admin_panel_settings', route: '/usuario' }
      ]
    }
  ];

  //útil para esconder itens sem permissão
  temPermissao(item: MenuItem): boolean {
    if (!item.permission) return true;
    return this.auth.hasPermission(item.permission);
  }

  rastrearPorTituloSecao(_: number, section: MenuSection): string {
    return section.title;
  }

  rastrearPorRota(_: number, item: MenuItem): string {
    return item.route;
  }
}