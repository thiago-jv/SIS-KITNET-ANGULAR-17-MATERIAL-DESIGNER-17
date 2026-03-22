import { Routes } from '@angular/router';

export const valorRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./valor.component').then(c => c.ValorComponent),
    data: { permission: 'PERM_VALOR_LIST' }
  },
  {
    path: 'listar',
    loadComponent: () => import('./listar-valor/listar-valor.component').then(c => c.ListarValorComponent),
    data: { permission: 'PERM_VALOR_LIST' }
  },
  {
    path: ':id/editar',
    loadComponent: () => import('./cadastrar-valor/cadastrar-valor.component').then(c => c.CadastrarValorComponent),
    data: { permission: 'PERM_VALOR_UPDATE' }
  }
];
