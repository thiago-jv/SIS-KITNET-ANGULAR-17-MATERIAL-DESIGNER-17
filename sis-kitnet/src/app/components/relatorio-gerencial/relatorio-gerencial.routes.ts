import { Routes } from '@angular/router';

export const relatorioGerencialRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./relatorio-gerencial.component').then(c => c.RelatorioGerencialComponent),
    data: { permission: 'PERM_LANCAMENTO_LIST' }
  }
];
