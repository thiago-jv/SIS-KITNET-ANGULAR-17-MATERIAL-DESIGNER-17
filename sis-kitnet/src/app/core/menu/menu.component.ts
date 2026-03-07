import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  exact?: boolean;
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
    RouterLinkActive
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  readonly menuSections: MenuSection[] = [
    {
      title: 'Principal',
      items: [
        { label: 'Indicadores', icon: 'dashboard', route: '/indicadores', exact: true },
        { label: 'Locação', icon: 'home_work', route: '/listar-controle-lancamento', exact: true }
      ]
    },
    {
      title: 'Cadastros',
      items: [
        { label: 'Apartamento', icon: 'apartment', route: '/listar-apartamento', exact: true },
        { label: 'Prédio', icon: 'location_city', route: '/listar-predio', exact: true },
        { label: 'Inquilino', icon: 'person_add', route: '/inquilino' },
        { label: 'Valor', icon: 'attach_money', route: '/listar-valor', exact: true }
      ]
    },
    {
      title: 'Sistema',
      items: [
        { label: 'Usuário', icon: 'admin_panel_settings', route: '/usuario' }
      ]
    }
  ];

  rastrearPorTituloSecao(_: number, section: MenuSection): string {
    return section.title;
  }

  rastrearPorRota(_: number, item: MenuItem): string {
    return item.route;
  }

}
