import { Injectable } from "@angular/core";
@Injectable()
export class Config {
  API_URL = "https://api.buynroll.tk/api/";
  API_URL_TEST = "https://api.buynroll.tk/api/test/";
  API_URL_ROOT = "https://api.buynroll.tk/";
  STATIC_FILES = "https://api.buynroll.tk/uploads/";
  BEARER: "Bearer ";
  isLoggedIn: boolean = false;
  retryCount = 3;
  user: any;
  featureUseChat: boolean = false;
  textAreaMaxLength = 150;
}
