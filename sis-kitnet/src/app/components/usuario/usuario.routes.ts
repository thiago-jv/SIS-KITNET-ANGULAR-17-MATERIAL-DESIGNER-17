import { Routes } from '@angular/router';

export const usuarioRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./usuario.component').then(c => c.UsuarioComponent)
  }
];
