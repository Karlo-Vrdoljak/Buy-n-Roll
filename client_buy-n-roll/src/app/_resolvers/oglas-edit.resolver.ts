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
import { Config } from 'src/environments/config';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class OglasEditResolver implements Resolve<unknown>{

  constructor(
    private router:Router,
    private errorHandler: ErrorHandler,
    private userService: UserService,
    private helperService: HelperService,
    private translate:TranslateService,
    private translationProvider:TranslationList,
    private oglasService: OglasService,
    private config:Config,
    private http:HttpClient,
    private vehicleService: VehicleService
  ){ }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){

    if(!route.params?.query || !route.queryParams?.username || route.queryParams.username != this.config.user.username) {
      const state: RouterState = this.router.routerState;
      this.errorHandler.handleRouterState(state,true);
      return;
    }
    
    let prevRoute = this.helperService.getLastNavigation();
    return forkJoin (
      this.userService.findUserByUsername(this.config.user.username),
      of(prevRoute),
      this.translate.get(this.translationProvider.getRegistration()),
      this.oglasService.findOglasByPk(route.params.query),
      this.http.get('assets/json/currency.json'),
      this.oglasService.getColors(),
      this.oglasService.getBody(),
      this.oglasService.getDriveTrain(),
      this.oglasService.getTransmission(),
      this.vehicleService.manufacturersFindAll()
    ).pipe(
      catchError(error => {
        const state: RouterState = this.router.routerState;
        this.errorHandler.handleRouterState(state);
        return this.errorHandler.handleError;
    }));
  }
}
