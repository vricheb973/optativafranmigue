import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const toastService = inject(ToastService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let message = 'An error occurred';
            if (error.error && typeof error.error === 'string') {
                message = error.error;
            } else if (error.message) {
                message = error.message;
            }

            console.error('HTTP Error:', error.status, message);

            // Don't show toast for 401 as it's handled by AuthInterceptor/Guard redirect
            if (error.status !== 401) {
                toastService.error(message);
            }

            return throwError(() => error);
        })
    );
};
