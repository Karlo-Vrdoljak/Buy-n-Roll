import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, RouterState, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ErrorHandler } from '../_services/errorHandler';
import { VehicleService } from '../_services/vehicle.service';


@Injectable()
export class LandingResolver implements Resolve<unknown>{

  constructor(
    private translate:TranslateService,
    private router:Router,
    private errorHandler: ErrorHandler,
    private vehicleService: VehicleService
  ){ }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    
    return forkJoin ([
      this.vehicleService.manufacturersFindAll(),
      // this.vehicleService.seriesFindAll()
      ]).pipe(
        catchError(error => {
          console.error(error);
          const state: RouterState = this.router.routerState;
          this.errorHandler.handleRouterState(state);
          return this.errorHandler.handleError('LandingResolver');
        })
      );
    }

    
}
