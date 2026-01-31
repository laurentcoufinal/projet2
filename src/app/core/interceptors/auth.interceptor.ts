import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';

/**
 * Intercepteur HTTP qui ajoute automatiquement le token JWT
 * dans l'en-tête Authorization de toutes les requêtes HTTP
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Si un token existe, l'ajouter dans l'en-tête Authorization
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  // Sinon, passer la requête sans modification
  return next(req);
};
