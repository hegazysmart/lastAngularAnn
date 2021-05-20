import { HandleErrorService } from './../services/handle-error.service';
import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppInterceptor implements HttpInterceptor {
    constructor(private error: HandleErrorService) { }
    token: string = '';
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // debugger;
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ` + localStorage.getItem('token')
            }
        });
        return next.handle(request).pipe() as any;
    }

}