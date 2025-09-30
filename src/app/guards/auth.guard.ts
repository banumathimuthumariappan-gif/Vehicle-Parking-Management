import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);

  const allowedRoles: string[] = route.data?.['roles'] || [];
  const currentRole = authService.getUserRole();
  console.log('Current role: ' + currentRole);
  console.log(allowedRoles);

  if (!currentRole || !allowedRoles.includes(currentRole)) {
    router.navigateByUrl('/login');
    return false;
  }

  return true;
};
