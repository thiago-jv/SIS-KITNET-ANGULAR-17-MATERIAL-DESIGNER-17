import { Routes } from '@angular/router';

export const controleLancamentoRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./listar-controle-lancamento/listar-controle-lancamento.component').then(c => c.ListarControleLancamentoComponent),
    data: { permission: 'PERM_LANCAMENTO_LIST' }
  },
  {
    path: 'novo',
    loadComponent: () => import('./cadastrar-controle-lancamento/cadastrar-controle-lancamento.component').then(c => c.CadastrarControleLancamentoComponent),
    data: { permission: 'PERM_LANCAMENTO_CREATE' }
  },
  {
    path: ':id/editar',
    loadComponent: () => import('./cadastrar-controle-lancamento/cadastrar-controle-lancamento.component').then(c => c.CadastrarControleLancamentoComponent),
    data: { permission: 'PERM_LANCAMENTO_UPDATE' }
  }
];
