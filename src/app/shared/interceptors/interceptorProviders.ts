import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { ServerErrorsInterceptor } from "./handleErrorInterceptor";
import { HeadersInterceptor } from "./headerInterceptor";
import { LoadingInterceptor } from "./laoderInterceptor";

export const interceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HeadersInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: LoadingInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ServerErrorsInterceptor,
    multi: true,
  },
];