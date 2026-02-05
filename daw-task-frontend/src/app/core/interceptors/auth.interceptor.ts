import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getAccessToken();

    let request = req;

    // Add token header if not an auth request (though standard checks url usually)
    // Backend "API interactions" - excluding auth.
    // We can just exclude /auth/login, /auth/register, /auth/refresh from adding token if we want, 
    // or add it always if we have it (backend should ignore if inconsistent).
    // But strictly: "excepto en las de auth".
    if (token && !req.url.includes('/auth/')) {
        request = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(request).pipe(
        catchError((error: HttpErrorResponse) => {
            // Handle 401
            if (error.status === 401 && !req.url.includes('/auth/login') && !req.url.includes('/auth/refresh')) {
                // Try refresh
                return authService.refreshToken().pipe(
                    switchMap((tokens) => {
                        // New tokens saved in authService.refreshToken tap
                        const newToken = tokens.access;
                        const newRequest = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${newToken}`
                            }
                        });
                        return next(newRequest);
                    }),
                    catchError((refreshErr) => {
                        // Refresh failed or we don't have a refresh token
                        // Auth service logout usually cleans up, but we can call it here too?
                        // AuthService.refreshToken calls logout if no token in storage.
                        // If api call fails, we rely on component/global error or auth service.
                        return throwError(() => refreshErr);
                    })
                );
            }
            return throwError(() => error);
        })
    );
};
