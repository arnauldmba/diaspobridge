import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUserValue();

  if (currentUser && currentUser.role === 'ADMIN') {
    return true;
  }

  const token = authService.getToken(); 

  if(!token){
    router.navigate(['/login']); 
    return false;
  }

  return authService.loadCurrentUser().pipe(
    map(user => {
      if (user.role === 'ADMIN') {
        return true;
      }

      router.navigate(['/app-forbidden']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};