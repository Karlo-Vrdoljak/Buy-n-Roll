import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Config } from 'src/environments/config';
import { retry, catchError } from 'rxjs/operators';
import { ErrorHandler } from './errorHandler';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(
    public http: HttpClient,
    public config:Config,
    public errorHandler:ErrorHandler
  ) { }

  testNestJSApi() {
    return this.http.get(this.config.API_URL_TEST, {}).pipe(
      retry(this.config.retryCount),
    );
  }
  testNestJWT() {
    return this.http.get(this.config.API_URL_TEST + 'protected').pipe(
      retry(this.config.retryCount),
    );
  }
  getToken(params) {
    return this.http.post(this.config.API_URL_ROOT + 'auth/login/', params ).pipe(
      retry(this.config.retryCount),
    );
  }
  testColorTable() {
    return this.http.get(this.config.API_URL_ROOT + "api/vehicle/color/").pipe(
      retry(this.config.retryCount),
    );
  }
  
}
