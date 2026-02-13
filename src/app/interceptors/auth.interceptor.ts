import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userEmail = localStorage.getItem('userEmail');
  
  if (userEmail) {
    const clonedRequest = req.clone({
      setHeaders: {
        'X-User-Email': userEmail
      }
    });
    return next(clonedRequest);
  }
  
  return next(req);
};