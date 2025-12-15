import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);

  // URLs à exclure : login & register
  const excluded = ['/auth/login', '/auth/register'];

  if (excluded.some(path => req.url.includes(path))) {
    return next(req);
  }

  const jwt = authService.getToken(); // peut être null

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
