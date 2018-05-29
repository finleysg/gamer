import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppErrorHandler } from './app-error-handler.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private errorHandler: AppErrorHandler) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(err => {
                return this.handleError(err);
            })
        );
    }

    handleError(err: any): Observable<any> {

        let message: string;
        if (err instanceof HttpErrorResponse) {
            if (err.status === 0) {
                console.log(err);
                message = `Could not reach the server because your internet connection
                           was lost, the connection timed out, or the server is not responding.`;
            } else {
                const body = err.error || {};
                if (body.non_field_errors) {
                    // django-rest-auth
                    message = body.non_field_errors[0];
                } else if (body.username) {
                    // django-rest-auth
                    message = body.username[0];
                } else if (body.detail) {
                    // django-rest-framework
                    message = body.detail;
                } else {
                    message = JSON.stringify(body);
                }
            }
            this.errorHandler.handleError(message);
        } else {
            this.errorHandler.logError(err);
            message = err.message ? err.message : err.toString();
        }

        return throwError(message);
    }
}
