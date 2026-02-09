import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/*

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const excluded = ['/api/auth/login', '/api/auth/register', '/api/auth/verifyEmail'];
  if (excluded.some(path => req.url.includes(path))) {
    return next(req);
  }

  const token = authService.getToken();
  const reqWithToken = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(reqWithToken).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        authService.logout(); 
        router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
      }
      return throwError(() => err);
    })
  );
};
*/

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const excluded = ['/api/auth/login', '/api/auth/register', '/api/auth/verifyEmail'];
  if (excluded.some(path => req.url.includes(path))) {
    return next(req);
  }

  const token = authService.getToken();
  const reqWithToken = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(reqWithToken).pipe(
    catchError((err: HttpErrorResponse) => {
      // Backend peut renvoyer un body JSON
      const body: any = err.error;

      const isDisabled =
        err.status === 403 &&
        body &&
        (body.errorCause === 'disabled' || body.error === 'disabled');

      const isAuthProblem =
        err.status === 401 ||
        (err.status === 403 && isDisabled) ||
        (err.status === 401 && body && (body.error === 'TOKEN_EXPIRED' || body.error === 'INVALID_TOKEN'));

      if (isAuthProblem) {
        authService.logout();

        // Option: stocker un message pour l’afficher sur la page login
        // (selon ton app: toast/snackbar/service message)
        if (isDisabled) {
          // ex: authService.setAuthMessage?.("Compte désactivé");
          // ou localStorage/sessionStorage
          sessionStorage.setItem('auth_error', 'Compte désactivé. Contactez le support.');
        } else if (body?.message) {
          sessionStorage.setItem('auth_error', body.message);
        }

        router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
      }

      return throwError(() => err);
    })
  );
};

