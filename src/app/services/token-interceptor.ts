import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const toExclude = '/login';

  /**
   * Tester s'il s'agit du login, on n'ajoute pas le header Authorization
   * puisqu'il n'y a pas encore de token à ce stade.
   */
  if(req.url.search(toExclude) === -1) {
    let jwt = authService.getToken();
    let reqWihtToken = req.clone({
      setHeaders: {
        Authorization: jwt
      }
    });
    return next(reqWihtToken);
  }

  return next(req);
};
