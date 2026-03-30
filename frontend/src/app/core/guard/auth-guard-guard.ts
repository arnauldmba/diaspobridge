import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuardGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/app-forbidden']);
    return false;
  }
};

export const authGuardGuard2: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

   if (authService.getCurrentUserValue()) {
    return true;
  }

  const token = authService.getToken();

  if (!token) {
    router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } }); // permet a l’utilisateur de revenir sur la page demandée après login :
    return false;
  }

  return authService.loadCurrentUser().pipe(
    map(() => true),
    catchError(() => {
      router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return of(false);
    })
  );
};
