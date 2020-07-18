import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Config } from "src/environments/config";
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ProtectedRoutes } from '../_types/misc';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: "root",
})
export class HelperService {

  loginSource = new BehaviorSubject(null);
  currentLogin = this.loginSource.asObservable();
  
  constructor(public http: HttpClient, public config: Config,public translate: TranslateService, private router:Router) {}

  dispatchUserLogin() {
    this.loginSource.next(null);
  }

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

  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  logOffRerouteUrl() {
    if(Object.values(ProtectedRoutes).some(pr => this.router.routerState.snapshot.url.includes(pr))) {
      return '/'
    } else {
      return '';
    }

  }

  getLastNavigation() {
    if(this.router.getCurrentNavigation()?.previousNavigation?.extractedUrl.toString() != undefined) {
      return this.router.getCurrentNavigation().previousNavigation.extractedUrl.toString()
    }
    return '/';
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
    str = str ?? '';
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + '...';
  }
  date(date: any) {
    
    let dateObj = null;
    if(typeof date == "string") {
      dateObj = new Date(date);
    } else if (typeof date == "object"){
      dateObj = date;
    }
    if(this.translate.currentLang == 'en') {
      return ('00' + dateObj.getDate()).slice(-2) + '/' + ('00' + (dateObj.getMonth() + 1)).slice(-2) + '/' + dateObj.getFullYear();
    } else {
      return ('00' + dateObj.getDate()).slice(-2) + '. ' + ('00' + (dateObj.getMonth() + 1)).slice(-2) + '. ' + dateObj.getFullYear() + '.';

    }
    // return dateObj.toLocaleDateString(this.translate.currentLang,  {
    //   day: '2-digit', month: '2-digit', year: 'numeric'
    // }) + ' ' + dateObj.toLocaleTimeString(this.translate.currentLang, {hour:'2-digit', minute:'2-digit'});
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
  abbreviateNumber(num, fixed = 0) {
    if (num === null) { return null; } // terminate early
    if (num === 0) { return '0'; } // terminate early
    fixed = (!fixed || fixed < 0) ? 0 : fixed; // number of decimal places to show
    var b = (num).toPrecision(2).split("e"), // get power
        k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
        c = k < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3) ).toFixed(1 + fixed), // divide by power
        d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
        e = d + ['', 'K', 'M', 'B', 'T'][k]; // append power
    return e;
  }
  objectEquals( x:any, y:any ) :boolean {
    if ( x === y ) return true;
    if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
    if ( x.constructor !== y.constructor ) return false;
    for ( var p in x ) {
      if ( ! x.hasOwnProperty( p ) ) continue;
      if ( ! y.hasOwnProperty( p ) ) return false;
      if ( x[ p ] === y[ p ] ) continue;
      if ( typeof( x[ p ] ) !== "object" ) return false;
      if ( ! this.objectEquals( x[ p ],  y[ p ] ) ) return false;
    }
    for ( p in y )
      if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) )
        return false;
    return true;
  }
}
