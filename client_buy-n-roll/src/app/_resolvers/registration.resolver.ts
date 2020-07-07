import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, RouterState, Router, } from "@angular/router";
import { HelperService } from '../_services/helper.service';
import { forkJoin, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TranslationList } from '../_services/translation.list';
import { catchError } from 'rxjs/operators';
import { ErrorHandler } from '../_services/errorHandler';

@Injectable()
export class RegistrationResolver implements Resolve<unknown> {

  constructor(
    private helperService: HelperService,
    private translate:TranslateService,
    private translationProvider:TranslationList,
    private router:Router,
    private errorHandler: ErrorHandler
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return forkJoin([
      of(this.helperService.getLastNavigation()),
      this.translate.get(this.translationProvider.getLanding())
    ]).pipe(
      catchError(error => {
        const state: RouterState = this.router.routerState;
        this.errorHandler.handleRouterState(state);
        return this.errorHandler.handleError;
      })
    );
  }
}
