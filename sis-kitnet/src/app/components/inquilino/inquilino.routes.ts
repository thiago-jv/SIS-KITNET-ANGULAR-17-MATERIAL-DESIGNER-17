import { Routes } from '@angular/router';

export const inquilinoRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./inquilino.component').then(c => c.InquilinoComponent),
    data: { permission: 'PERM_INQUILINO_LIST' }
  },
  {
    path: 'listar',
    loadComponent: () => import('./listar-inquilino/listar-inquilino.component').then(c => c.ListarInquilinoComponent),
    data: { permission: 'PERM_INQUILINO_LIST' }
  },
  {
    path: 'novo',
    loadComponent: () => import('./cadastrar-inquilino/cadastrar-inquilino.component').then(c => c.CadastrarInquilinoComponent),
    data: { permission: 'PERM_INQUILINO_CREATE' }
  },
  {
    path: ':id/editar',
    loadComponent: () => import('./cadastrar-inquilino/cadastrar-inquilino.component').then(c => c.CadastrarInquilinoComponent),
    data: { permission: 'PERM_INQUILINO_UPDATE' }
  }
];
