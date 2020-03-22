import { Injectable } from "@angular/core";
@Injectable()
export class Config {
    API_URL = 'http://localhost:3000/api/';
    API_URL_TEST = 'http://localhost:3000/api/test/';
    API_URL_ROOT = 'http://localhost:3000/';
    BEARER:'Bearer ';
    isLoggedIn:boolean = true;
}