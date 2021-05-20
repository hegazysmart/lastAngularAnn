import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppInterceptor } from "./appInterceptor";
import { LoadingInterceptor } from "./laoderInterceptor";

export const interceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true }
];