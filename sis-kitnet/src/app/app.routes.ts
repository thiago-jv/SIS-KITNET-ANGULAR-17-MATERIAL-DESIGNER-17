
import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { LayoutComponent } from './core/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./components/home/home.routes').then(m => m.homeRoutes)
      },
      {
        path: 'indicadores',
        loadChildren: () => import('./components/indicadores/indicadores.routes').then(m => m.indicadoresRoutes)
      },
      {
        path: 'apartamento',
        loadChildren: () => import('./components/apartamento/apartamento.routes').then(m => m.apartamentoRoutes)
      },
      {
        path: 'predio',
        loadChildren: () => import('./components/predio/predio.routes').then(m => m.predioRoutes)
      },
      {
        path: 'inquilino',
        loadChildren: () => import('./components/inquilino/inquilino.routes').then(m => m.inquilinoRoutes)
      },
      {
        path: 'valor',
        loadChildren: () => import('./components/valor/valor.routes').then(m => m.valorRoutes)
      },
      {
        path: 'controle-lancamento',
        loadChildren: () => import('./components/controle-lancamento/controle-lancamento.routes').then(m => m.controleLancamentoRoutes)
      },
      {
        path: 'movimento-financeiro',
        loadChildren: () => import('./components/movimento-financeiro/movimento-financeiro.routes').then(m => m.movimentoFinanceiroRoutes)
      },
      {
        path: 'relatorio-gerencial',
        loadChildren: () => import('./components/relatorio-gerencial/relatorio-gerencial.routes').then(m => m.relatorioGerencialRoutes)
      },
      {
        path: 'usuario',
        loadChildren: () => import('./components/usuario/usuario.routes').then(m => m.usuarioRoutes)
      }
    ]
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login.routes').then(m => m.loginRoutes)
  },
  {
    path: 'nao-autorizado',
    loadChildren: () => import('./components/acesso-negado/acesso-negado.routes').then(m => m.acessoNegadoRoutes)
  },
  { path: '**', redirectTo: '' }
];