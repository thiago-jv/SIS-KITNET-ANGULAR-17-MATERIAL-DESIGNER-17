import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getToken();
  
  if (!token) {
    router.navigate(['/login']);
    return false;
  }
  if (auth.isTokenExpired(token)) {
    router.navigate(['/login']);
    return false;
  }

  // Checagem de permissão granular
  const requiredPermission = next.data && next.data['permission'];
  if (requiredPermission && !auth.hasPermission(requiredPermission)) {
    router.navigate(['/nao-autorizado']);
    return false;
  }

  return true;
};
