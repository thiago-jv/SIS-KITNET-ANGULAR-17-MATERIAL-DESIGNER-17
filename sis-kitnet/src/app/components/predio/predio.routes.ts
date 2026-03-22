import { Routes } from '@angular/router';

export const predioRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./predio.component').then(c => c.PredioComponent),
    data: { permission: 'PERM_PREDIO_LIST' }
  },
  {
    path: 'listar',
    loadComponent: () => import('./listar-predio/listar-predio.component').then(c => c.ListarPredioComponent),
    data: { permission: 'PERM_PREDIO_LIST' }
  },
  {
    path: 'novo',
    loadComponent: () => import('./cadastrar-predio/cadastrar-predio.component').then(c => c.CadastrarPredioComponent),
    data: { permission: 'PERM_PREDIO_CREATE' }
  },
  {
    path: ':id/editar',
    loadComponent: () => import('./cadastrar-predio/cadastrar-predio.component').then(c => c.CadastrarPredioComponent),
    data: { permission: 'PERM_PREDIO_UPDATE' }
  }
];
