import { DataShareService } from './../services/data-shared.service';
import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from 'rxjs/operators';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private dataShare: DataShareService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.dataShare.enableLoader();
    return next.handle(request).pipe(finalize(() => this.dataShare.disableLoader()));
  }
}