import { DataShareService } from './data-shared.service';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { formValidation } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class HandleErrorService {

  serverErrors$: Observable<any> = this.sharedData.serverErrors$;

  constructor(private sharedData: DataShareService, private toaster: ToastrService, private router: Router) { }


  public handleError(err: HttpErrorResponse) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A Client side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The Backend returned an unsuccessful response code.
      switch (err.status) {
        case 400:
          errorMessage = 'Bad Request';
          break;
        case 401:
          errorMessage = `You need to Login to do this action.`;
          setTimeout(() => {
            this.router.navigate(['auth']);
            // Clear Token
            const tkn = localStorage.getItem('token') || null;
            tkn ? localStorage.removeItem('token') : '';
          }, 1000);
          break;
        case 403:
          errorMessage = `You don't have permission to access the requested resource.`;
          break;
        case 404:
          errorMessage = `The requested resources does not exist.`
          break;
        case 412:
          errorMessage = `Precondition Faild.`
          break;
        case 500:
          errorMessage = `Internal Server Error.`;
          break;
        case 503:
          errorMessage = `The requested service is not available.`;
          break;
        case 422:
          errorMessage = ``;
          this.handleBackendValidations(err);
          break
        default:
          errorMessage = `Something want wrong`
          break;
      }
    }
    if (errorMessage) {
      this.toaster.error(errorMessage)
    }
  }

  // Handling backend custom error messages
  public handleBackendValidations(error: HttpErrorResponse) {
    const errors: any = {};
    for (const key in error.error.errors) {
      if (Object.prototype.hasOwnProperty.call(error.error.errors, key)) {
        errors[key] = error.error.errors[key];
        this.toaster.error(errors[key][0], 'Validation Error');
      }
    }
    // adding error obj to the global serverError Observable
    this.sharedData.addServerErrors(errors);
  }
}
