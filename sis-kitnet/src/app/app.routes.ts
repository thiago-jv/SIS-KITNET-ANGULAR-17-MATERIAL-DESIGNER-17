import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'apartamento',
    loadComponent: () =>
      import('./components/apartamento/apartamento.component')
        .then(c => c.ApartamentoComponent)
  },
  {
    path: 'apartamento/:id',
    loadComponent: () =>
      import('./components/apartamento/apartamento.component')
        .then(c => c.ApartamentoComponent)
  },
  {
    path: 'listar-apartamento',
    loadComponent: () =>
      import('./components/apartamento/listar-apartamento/listar-apartamento.component')
        .then(c => c.ListarApartamentoComponent)
  },
  {
    path: 'inquilino',
    loadComponent: () =>
      import('./components/inquilino/inquilino.component')
        .then(c => c.InquilinoComponent)
  },
  {
    path: 'locacao',
    loadComponent: () =>
      import('./components/locacao/locacao.component')
        .then(c => c.LocacaoComponent)
  },
  {
    path: 'predio',
    loadComponent: () =>
      import('./components/predio/predio.component')
        .then(c => c.PredioComponent)
  },
  {
    path: 'predio/:id',
    loadComponent: () =>
      import('./components/predio/predio.component')
        .then(c => c.PredioComponent)
  },
  {
    path: 'listar-predio',
    loadComponent: () =>
      import('./components/predio/listar-predio/listar-predio.component')
        .then(c => c.ListarPredioComponent)
  },
  {
    path: 'usuario',
    loadComponent: () =>
      import('./components/usuario/usuario.component')
        .then(c => c.UsuarioComponent)
  },
  {
    path: 'valor',
    loadComponent: () =>
      import('./components/valor/valor.component')
        .then(c => c.ValorComponent)
  },
  {
    path: 'valor/:id',
    loadComponent: () =>
      import('./components/valor/valor.component')
        .then(c => c.ValorComponent)
  },
  {
    path: 'listar-valor',
    loadComponent: () =>
      import('./components/valor/listar-valor/listar-valor.component')
        .then(c => c.ListarValorComponent)
  }
];
