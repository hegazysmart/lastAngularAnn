import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApisService {

  constructor(private httpClient: HttpClient) { }

  POST<T>(url: any, body?: any, params?: any) {
    return this.httpClient.post<T>(`${environment.baseURL}${url}`, body, {
      params: { ...params },
      observe: 'response'
    })
  }

  GET<T>(url: any, params?: any) {
    return this.httpClient.get<T>(`${environment.baseURL}${url}`, {
      params: { ...params },
      observe: 'response'
    })
  }

  DELETE<T>(url: any, params?: any) {
    return this.httpClient.delete<T>(`${environment.baseURL}${url}`, {
      params: { ...params },
      observe: 'response'
    })
  }

  PUT<T>(url: any, body?: any, params?: any) {
    return this.httpClient.put<T>(`${environment.baseURL}${url}`, body, {
      params: { ...params },
      observe: 'response'
    })
  }

  PATCH<T>(url: any, body?: any, params?: any) {
    return this.httpClient.patch<T>(`${environment.baseURL}${url}`, body, {
      params: { ...params },
      observe: 'response'
    })
  }

}
