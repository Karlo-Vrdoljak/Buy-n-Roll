import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Config } from 'src/environments/config';
import { retry, catchError } from 'rxjs/operators';
import { ErrorHandler } from './errorHandler';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    public http: HttpClient,
    public config:Config,
    public errorHandler:ErrorHandler
  ) { }

  getToken(params) {
    return this.http.post(this.config.API_URL_ROOT + 'auth/login/', params ).pipe(
      retry(this.config.retryCount),
    );
  }
  
}
