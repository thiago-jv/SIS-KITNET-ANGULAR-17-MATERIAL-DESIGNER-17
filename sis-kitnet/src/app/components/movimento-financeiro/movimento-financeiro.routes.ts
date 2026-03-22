import { Routes } from '@angular/router';

export const movimentoFinanceiroRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./listar-movimento-financeiro/listar-movimento-financeiro.component').then(c => c.ListarMovimentoFinanceiroComponent),
    data: { permission: 'PERM_MOVIMENTO_FINANCEIRO_LIST' }
  },
  {
    path: 'novo',
    loadComponent: () => import('./cadastrar-movimento-financeiro/cadastrar-movimento-financeiro.component').then(c => c.CadastrarMovimentoFinanceiroComponent),
    data: { permission: 'PERM_MOVIMENTO_FINANCEIRO_CREATE' }
  },
  {
    path: ':id/editar',
    loadComponent: () => import('./cadastrar-movimento-financeiro/cadastrar-movimento-financeiro.component').then(c => c.CadastrarMovimentoFinanceiroComponent),
    data: { permission: 'PERM_MOVIMENTO_FINANCEIRO_UPDATE' }
  }
];
