import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'apartamento',
    loadComponent: () =>
      import('./components/apartamento/apartamento.component')
        .then(c => c.ApartamentoComponent)
  },
  {
    path: 'diario',
    loadComponent: () =>
      import('./components/diario/diario.component')
        .then(c => c.DiarioComponent)
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
];
