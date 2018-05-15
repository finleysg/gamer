import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor() {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('gamer-token') || sessionStorage.getItem('gamer-token');
        const request = !token ? req.clone() : req.clone({
            headers: req.headers.set('Authorization', `Token ${token}`)
        });
        return next.handle(request);
    }
}
