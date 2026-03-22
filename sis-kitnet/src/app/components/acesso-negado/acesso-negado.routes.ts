import { Routes } from '@angular/router';

export const acessoNegadoRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./acesso-negado.component').then(c => c.AcessoNegadoComponent)
  }
];
