import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Config } from 'src/environments/config';
import { retry, catchError } from 'rxjs/operators';
import { ErrorHandler } from './errorHandler';
import { LocalStorageService } from 'angular-web-storage';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { of } from 'rxjs';
import { HelperService } from './helper.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    public http: HttpClient,
    public config:Config,
    public errorHandler:ErrorHandler,
    private storage:LocalStorageService,
    private helperService: HelperService

  ) { }

  getToken(params) {
    return this.http.post(this.config.API_URL_ROOT + 'auth/login/', params ).pipe(
      retry(this.config.retryCount),
      catchError(this.errorHandler.handleError)

    );
  }
  
  private checkJWT(params) {
    return this.http.post(this.config.API_URL_ROOT + 'auth/check/', params ).pipe(
      retry(this.config.retryCount),
      catchError(this.errorHandler.handleError)
    );
  }

  checkToken(loader?:NgxUiLoaderService, key?:string): Promise<boolean> {
    return new Promise(resolve => {
      let auth = this.storage.get('auth');
      if(auth) {
        this.checkJWT({jwt: auth.access_token}).subscribe(data => {
          this.config.user = data;
          this.config.isLoggedIn = true;
          this.helperService.dispatchUserLogin();
          resolve(true);
        }, err => {
          this.config.user = null;
          this.config.isLoggedIn = false;
          this.storage.remove('auth');
          loader?.stopLoader(key);
          resolve(false);
        });
      } else {
        resolve(false);
      }
    });
  }

  getLocation(params) {
    return this.http.post(this.config.API_URL_ROOT + 'user/findLocation/query/', params ).pipe(
      retry(this.config.retryCount),
      catchError(this.errorHandler.handleError)
    );
  }
  registerUserStepOne(params) {
    return this.http.post(this.config.API_URL_ROOT + 'user/register/', params ).pipe(
      retry(this.config.retryCount),
      catchError(this.errorHandler.handleError)
    );
  }
  registerUserStepTwo(params) {
    return this.http.post(this.config.API_URL_ROOT + 'user/registerFinalize/', params ).pipe(
      retry(this.config.retryCount),
      catchError(this.errorHandler.handleError)
    );
  }
  checkUniqueUsername(params) {
    return this.http.post(this.config.API_URL_ROOT + 'user/check/username/', params ).pipe(
      retry(this.config.retryCount),
      catchError(this.errorHandler.handleError)
    );
  }
  uploadImage(params: File,username:string) {
    let headers = new HttpHeaders().set('username-value', username);
    const formData: FormData = new FormData();
    formData.append("image", params, params?.name);
    return this.http.post(this.config.API_URL_ROOT + "user/upload/", formData, {headers: headers});
  }
  checkCodeByUsername(params) {
    return this.http.post(this.config.API_URL_ROOT + 'user/check/code/', params ).pipe(
      retry(this.config.retryCount),
      catchError(this.errorHandler.handleError)
    );
  }
  getUserPhoto(username) {
    if(!username) {
      return of(null);
    }
    return this.http.get(this.config.API_URL_ROOT + 'user/getPhoto/' + username ).pipe(
      retry(this.config.retryCount),
      catchError(this.errorHandler.handleError)
    );
  }
  findUserByUsername(username) {
    return this.http.get(this.config.API_URL_ROOT + 'user/data/' + username ).pipe(
      retry(this.config.retryCount),
      catchError(this.errorHandler.handleError)
    );
  }
}
