import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'indicadores',
    pathMatch: 'full'
  },
  {
    path: 'indicadores',
    loadComponent: () =>
      import('./components/indicadores/indicadores-resumo.component')
        .then(c => c.IndicadoresResumoComponent)
  },
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
    path: 'inquilino/:id',
    loadComponent: () =>
      import('./components/inquilino/inquilino.component')
        .then(c => c.InquilinoComponent)
  },
  {
    path: 'listar-inquilino',
    loadComponent: () =>
      import('./components/inquilino/listar-inquilino/listar-inquilino.component')
        .then(c => c.ListarInquilinoComponent)
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
  },
  {
    path: 'controle-lancamento',
    loadComponent: () =>
      import('./components/controle-lancamento/controle-lancamento.component')
        .then(c => c.ControleLancamentoComponent)
  },
  {
    path: 'controle-lancamento/:id',
    loadComponent: () =>
      import('./components/controle-lancamento/controle-lancamento.component')
        .then(c => c.ControleLancamentoComponent)
  },
  {
    path: 'listar-controle-lancamento',
    loadComponent: () =>
      import('./components/controle-lancamento/listar-controle-lancamento/listar-controle-lancamento.component')
        .then(c => c.ListarControleLancamentoComponent)
  },
  {
    path: 'listar-movimento-financeiro',
    loadComponent: () =>
      import('./components/movimento-financeiro/listar-movimento-financeiro/listar-movimento-financeiro.component')
        .then(c => c.ListarMovimentoFinanceiroComponent)
  },
  {
    path: 'cadastrar-movimento-financeiro',
    loadComponent: () =>
      import('./components/movimento-financeiro/cadastrar-movimento-financeiro/cadastrar-movimento-financeiro.component')
        .then(c => c.CadastrarMovimentoFinanceiroComponent)
  },
  {
    path: 'movimento-financeiro',
    loadComponent: () =>
      import('./components/movimento-financeiro/movimento-financeiro.component')
        .then(c => c.MovimentoFinanceiroComponent)
  },
  {
    path: 'movimento-financeiro/:id',
    loadComponent: () =>
      import('./components/movimento-financeiro/movimento-financeiro.component')
        .then(c => c.MovimentoFinanceiroComponent)
  },
  {
    path: 'relatorio-gerencial',
    loadComponent: () =>
      import('./components/relatorio-gerencial/relatorio-gerencial.component')
        .then(c => c.RelatorioGerencialComponent)
  },
  {
    path: '**',
    redirectTo: 'indicadores'
  }
];
