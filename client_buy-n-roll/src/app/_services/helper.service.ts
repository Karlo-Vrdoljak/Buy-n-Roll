import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Config } from "src/environments/config";
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: "root",
})
export class HelperService {
  constructor(public http: HttpClient, public config: Config,public translate: TranslateService) {}

  shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }

  isPortrait() {
    return window.innerHeight > window.innerWidth;
  }
  isLandscape() {
    return (window.orientation === 90 || window.orientation === -90);
  }
  private removeByIndex(str,index) {
    if (index==0) {
        return  str.slice(1)
    } else {
        return str.slice(0,index) + str.slice(index +1);
    } 
  }
  sanitizeQuery(query:string) {
    let unsafe = ["\"", "<", ">", "#", "%", "{","}", "|", "\\", "^", "~", "[", "]", "`", ";", "/", "?", ":", "@", "=", "&", "$"];
    for (let i = 0; i < query.length; i++) {
      unsafe.map(u => {
        if(query[i] && query.includes(u)) {
          query = this.removeByIndex(query, query.indexOf(u));
          i = 0;
        }
      });
    }
    return query;
  }
  truncateString(str:string, num:number) {
    if (str.length <= num) {
      return str
    }
    return str.slice(0, num) + '...'
  }
  date(date: string) {
    let dateObj = new Date(date);
    return dateObj.toLocaleDateString(this.translate.currentLang) + ' ' + dateObj.toLocaleTimeString(this.translate.currentLang);
  }
  getScreenY() {
    return screen.availHeight;
  }
  getScreenX() {
    return screen.availWidth;
  }
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }
  fibonacci(n){
    let arr = [0, 1];
    for (let i = 2; i < n + 1; i++){
      arr.push(arr[i - 2] + arr[i -1])
    }
   return arr[n]
  }
}
