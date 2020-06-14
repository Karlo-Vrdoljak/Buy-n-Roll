import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, RouterState, Router, } from "@angular/router";

@Injectable()
export class LoginResolver implements Resolve<unknown> {
  constructor(
    private router:Router
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(this.router.getCurrentNavigation().previousNavigation && this.router.getCurrentNavigation().previousNavigation.extractedUrl && this.router.getCurrentNavigation().previousNavigation.extractedUrl.toString()) {
      return this.router.getCurrentNavigation().previousNavigation.extractedUrl.toString()
    }
    return '/';
  }
}
