import { Routes } from '@angular/router';

export const indicadoresRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./indicadores-resumo.component').then(c => c.IndicadoresResumoComponent),
    data: { permission: 'PERM_INDICADORES_LIST' }
  }
];
