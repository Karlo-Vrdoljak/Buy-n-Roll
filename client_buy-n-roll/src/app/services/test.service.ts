import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Config } from 'src/environments/config';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(
    public http: HttpClient,
    public config:Config
  ) { }

  testNestJSApi() {
    return this.http.get(this.config.API_URL_TEST, {});
  }
  testNestJWT() {
    return this.http.get(this.config.API_URL_TEST + 'protected');
  }
  getToken(params) {
    return this.http.post(this.config.API_URL_ROOT + 'auth/login/', params );
  }
  
}
