import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService); // Inyección manual del servicio
  const token = tokenService.getToken(); // Obtener el token

  // Clonar la solicitud si hay un token
  const clonedRequest = token
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      })
    : req;

  return next(clonedRequest);
};
