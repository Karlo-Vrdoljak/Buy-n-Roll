import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, RouterState, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ErrorHandler } from '../_services/errorHandler';
import { VehicleService } from '../_services/vehicle.service';
import { TranslationList } from '../_services/translation.list';
import { SearchService } from '../_services/search.service';
import { searchTypes } from '../_types/misc';


@Injectable()
export class CatalogueResolver implements Resolve<unknown>{

  constructor(
    private translate:TranslateService,
    private router:Router,
    private errorHandler: ErrorHandler,
    private vehicleService: VehicleService,
    private translationList: TranslationList,
    private searchService: SearchService
  ){ }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    if(route.queryParams.searchType == searchTypes.text) {
      return forkJoin (
        this.searchService.findOglasiBySearchQuery(route.params.query),
        this.translate.get(this.translationList.getCatalogues())
      ).pipe(
        catchError(error => {
          const state: RouterState = this.router.routerState;
          this.errorHandler.handleRouterState(state);
          return this.errorHandler.handleError;
      }));
      
    } else if (route.queryParams.searchType == searchTypes.pickList) {
      return forkJoin(
        this.searchService.findOglasiByManufSerieModel(route.params),
        this.translate.get(this.translationList.getCatalogues())
      ).pipe(
        catchError(error => {
          const state: RouterState = this.router.routerState;
          this.errorHandler.handleRouterState(state);
          return this.errorHandler.handleError;
      }));
    }
  }
}
