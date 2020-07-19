import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'angular-web-storage';
import { UserService } from '../_services/user.service';
import { Config } from 'src/environments/config';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  constructor(private storage:LocalStorageService, private userService: UserService, private config: Config, public router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let auth = this.storage.get('auth');
      if(auth) {
        return this.userService.checkToken().then(result => {
          if(result == true) {
            return true
          } else {
            this.router.navigate(['/login'] , { skipLocationChange: true });
            return false;
          }
        });
      }
    this.router.navigate(['/login'], { skipLocationChange: true });
    return false;
  }
  
}
