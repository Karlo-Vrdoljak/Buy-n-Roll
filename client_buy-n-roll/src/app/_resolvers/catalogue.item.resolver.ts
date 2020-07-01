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


@Injectable()
export class CatalogueItemResolver implements Resolve<unknown>{

  constructor(
    private translate:TranslateService,
    private router:Router,
    private errorHandler: ErrorHandler,
    private vehicleService: VehicleService,
    private translationList: TranslationList,
    private oglasService: OglasService
  ){ }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    let prevRoute = null;
    if(this.router.getCurrentNavigation().previousNavigation?.extractedUrl.toString() != undefined) {
      prevRoute = this.router.getCurrentNavigation().previousNavigation.extractedUrl.toString();
    }
    return forkJoin (
      this.oglasService.findOglasByPk(route.params.query),
      of(prevRoute)
      // this.translate.get(this.translationList.getCatalogues())
    ).pipe(
      catchError(error => {
        const state: RouterState = this.router.routerState;
        this.errorHandler.handleRouterState(state);
        return this.errorHandler.handleError;
    }));
  }
}
