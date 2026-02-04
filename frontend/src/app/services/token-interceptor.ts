import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/*
ancinne version
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  // URLs à exclure : login & register
  const excluded = ['/auth/login', '/auth/register', '/auth/verifyEmail']; // ajouter (dernier)

  if (excluded.some(path => req.url.includes(path))) {
    return next(req);
  }

  const jwt = authService.getToken(); // peut être null
  

  if (!jwt) return next(req); // ajoute 

  // Pas de token → on n'ajoute rien
  if (!jwt) {
    return next(req);
  }

  const authHeader = jwt.startsWith('Bearer ') ? jwt : `Bearer ${jwt}`;

  const reqWithToken = req.clone({
    setHeaders: {
      Authorization: authHeader,
    },
  });

  return next(reqWithToken);
};
*/

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const excluded = ['/api/auth/login', '/api/auth/register', '/api/auth/verifyEmail'];
  if (excluded.some(path => req.url.includes(path))) {
    return next(req);
  }

  const token = authService.getToken(); // ✅ raw ou null (purge si expiré)
  const reqWithToken = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(reqWithToken).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        authService.logout(); // ✅ supprime le token & état
        router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
      }
      return throwError(() => err);
    })
  );
};

