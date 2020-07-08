import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, RouterState, Router, } from "@angular/router";
import { HelperService } from '../_services/helper.service';

@Injectable()
export class LastNavigation implements Resolve<unknown> {
  constructor(
    private helperService: HelperService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.helperService.getLastNavigation();
  }
}
