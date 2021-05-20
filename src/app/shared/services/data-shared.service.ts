import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DataShareService {
  constructor(
  ) { }

  loaderSubject = new BehaviorSubject(false);
  public loader$ = this.loaderSubject.asObservable();


  serverErrorsSubject = new BehaviorSubject(null);
  public serverErrors$ = this.serverErrorsSubject.asObservable();

  // Loader
  enableLoader() {
    this.loaderSubject.next(true);
  }
  disableLoader() {
    this.loaderSubject.next(false);
  }

  // Server Errors
  addServerErrors(errors: any) {
    this.serverErrorsSubject.next(errors);
  }
  removeServerErrors() {
    // remove server errors in every ng on init form component
    this.serverErrorsSubject.next(null);
  }
}