import { DataShareService } from './../services/data-shared.service';
import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  response: any;

  private requests: HttpRequest<any>[] = [];
  removeRequest(req:any) {
    this.requests = this.requests.filter((r) => r !== req);
    if (!this.requests.length) {
      this.dataShare.disableLoader();
    }
  }

  constructor(private dataShare: DataShareService) {}

  // intercept function
  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // collecting all the requests inside an array
    this.requests.push(req);

    // enable loader when sending a request
    this.dataShare.enableLoader();
    // returning an observable to complete the request cycle
    return new Observable((observer) => {
      next.handle(req).subscribe(
        (res) => {
          if (res instanceof HttpResponse) {
            this.response = res;
            observer.next(res);
            // removing the request when recieving a response to disable loader
            this.removeRequest(req);
          }
        },
        (err: HttpErrorResponse) => {
          // removing the request when recieving an error to disable loader
          this.removeRequest(req);
          // passing the response to other interceptors in the chain
          observer.next(this.response);
        }
      );
    });
  }
}