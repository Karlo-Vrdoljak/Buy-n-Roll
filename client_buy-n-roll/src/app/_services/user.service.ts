import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Config } from 'src/environments/config';
import { retry, catchError } from 'rxjs/operators';
import { ErrorHandler } from './errorHandler';
import { LocalStorageService } from 'angular-web-storage';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    public http: HttpClient,
    public config:Config,
    public errorHandler:ErrorHandler,
    private storage:LocalStorageService,

  ) { }

  getToken(params) {
    return this.http.post(this.config.API_URL_ROOT + 'auth/login/', params ).pipe(
      retry(this.config.retryCount),
    );
  }
  
  private checkJWT(params) {
    return this.http.post(this.config.API_URL_ROOT + 'auth/check/', params ).pipe(
      retry(this.config.retryCount),
      // catchError(this.errorHandler.handleError)
    );
  }

  checkToken(): Promise<boolean> {
    return new Promise(resolve => {
      let auth = this.storage.get('auth');
      if(auth) {
        this.checkJWT({jwt: auth.access_token}).subscribe(data => {
          this.config.user = data;
          this.config.isLoggedIn = true;
          resolve(true);
        }, err => {
          this.config.user = null;
          this.config.isLoggedIn = false;
          this.storage.remove('auth');
          resolve(false);
        });
      } else {
        resolve(false);
      }
    });
  }
  
}
