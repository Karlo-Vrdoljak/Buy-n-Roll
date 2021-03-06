import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, RouterState, Router } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ErrorHandler } from '../_services/errorHandler';
import { VehicleService } from '../_services/vehicle.service';
import { TranslationList } from '../_services/translation.list';
import { SearchService } from '../_services/search.service';
import { searchTypes } from '../_types/misc';
import { OglasService } from '../_services/oglas.service';
import { HelperService } from '../_services/helper.service';
import { UserService } from '../_services/user.service';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class FavouritesResolver implements Resolve<unknown>{

  constructor(
    private router:Router,
    private errorHandler: ErrorHandler,
    private userService: UserService,
    private helperService: HelperService,
    private translate:TranslateService,
    private translationProvider:TranslationList,
    private oglasService: OglasService,
    private http: HttpClient

  ){ }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){

    if(!route.params.query) {
      const state: RouterState = this.router.routerState;
      this.errorHandler.handleRouterState(state,true);
      return;
    }
    
    let prevRoute = this.helperService.getLastNavigation();
    return forkJoin (
      this.userService.findUsersFavouritedOglas(route.params.query),
      of(prevRoute),
      this.translate.get(this.translationProvider.getRegistration()),
    ).pipe(
      catchError(error => {
        const state: RouterState = this.router.routerState;
        this.errorHandler.handleRouterState(state);
        return this.errorHandler.handleError;
    }));
  }
}
