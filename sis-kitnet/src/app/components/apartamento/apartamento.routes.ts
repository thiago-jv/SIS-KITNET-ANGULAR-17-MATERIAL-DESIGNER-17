import { Routes } from '@angular/router';

export const apartamentoRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./apartamento.component').then(c => c.ApartamentoComponent),
    data: { permission: 'PERM_APARTAMENTO_LIST' }
  },
  {
    path: 'listar',
    loadComponent: () => import('./listar-apartamento/listar-apartamento.component').then(c => c.ListarApartamentoComponent),
    data: { permission: 'PERM_APARTAMENTO_LIST' }
  },
  {
    path: 'novo',
    loadComponent: () => import('./cadastra-apartamento/cadastra-apartamento.component').then(c => c.CadastraApartamentoComponent),
    data: { permission: 'PERM_APARTAMENTO_CREATE' }
  },
  {
    path: ':id/editar',
    loadComponent: () => import('./cadastra-apartamento/cadastra-apartamento.component').then(c => c.CadastraApartamentoComponent),
    data: { permission: 'PERM_APARTAMENTO_UPDATE' }
  }
];
