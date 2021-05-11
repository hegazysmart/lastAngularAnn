import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpResponse,
} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {
  response: any

  constructor() { }

  // intercept function
  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const JWT = localStorage.getItem('token');
    if (JWT) {
      const requWithJWT = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${JWT}`),
      });
      return next.handle(requWithJWT);
    } else {
      return next.handle(req);
    }
  }
}