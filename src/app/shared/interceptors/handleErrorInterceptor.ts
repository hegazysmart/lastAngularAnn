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
import { DataShareService } from "../services/data-shared.service";
import { HandleErrorService } from "../services/handle-error.service";

@Injectable()
export class ServerErrorsInterceptor implements HttpInterceptor {
  response: any;
  constructor(
    private dataShare: DataShareService,
    private error: HandleErrorService
  ) {}

  // intercept function
  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // returning an observable to complete the request cycle
    return new Observable((observer) => {
      next.handle(req).subscribe(
        (res: any) => {
          if (res instanceof HttpResponse) {
            this.response = res;
            observer.next(res);
            // Clear old Errors in case success
            this.dataShare.removeServerErrors();
          }
        },
        (err: HttpErrorResponse) => {
            this.dataShare.disableLoader();
          // Display error message via toasters
          this.error.handleError(err);
          // passing the response to other interceptors in the chain
          observer.next(this.response);
        }
      );
    });
  }
}