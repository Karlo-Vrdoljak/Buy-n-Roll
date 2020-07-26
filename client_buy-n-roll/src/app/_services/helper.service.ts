import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Config } from "src/environments/config";
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ProtectedRoutes } from '../_types/misc';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { NgModel } from '@angular/forms';

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
      return '/';
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
  getPropDeep(target = null, ...keys:string[]) {
    if(keys.length == 0) return target;
    let key = keys.shift();
    return this.getPropDeep(target[key], ...keys)
  }
  padZero(str, len = null) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}

  invertColor(hex, bw = true) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    let rStr = (255 - r).toString(16);
    let gStr = (255 - g).toString(16);
    let bStr = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + this.padZero(rStr) + this.padZero(gStr) + this.padZero(bStr);
  }
  hasError(...items:NgModel[]) {
    if (items.every(i => i == undefined)) {
      return true;
    } 
    return items.map(i => i?.control.status == 'VALID' || i?.control.pristine == true ? true : null).every(e => e != null);
  }
  falsyCheck(...items:any[]) {
    if (items.every(i => i == undefined)) {
      return true;
    } 
    return items.map(i => i? true : null).every(e => e != null);
  }

}
