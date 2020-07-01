import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Config } from 'src/environments/config';
import { retry, catchError } from 'rxjs/operators';
import { ErrorHandler } from './errorHandler';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(
    public http: HttpClient,
    public config:Config,
    public errorHandler:ErrorHandler
  ) { }
  
  colorsFindAll() {
    return this.http.get(this.config.API_URL_ROOT + "api/vehicle/color/").pipe(
      retry(this.config.retryCount),
      catchError(this.errorHandler.handleError)
    );
  }
  manufacturersFindAll() {
    return this.http.get(this.config.API_URL_ROOT + "api/vehicle/manufacturer/").pipe(
      retry(this.config.retryCount),
      catchError(this.errorHandler.handleError)
    );
  }
  seriesFindByPkmanufacturer(data) {
    return this.http.get(this.config.API_URL_ROOT + "api/vehicle/series/" + data).pipe(
      retry(this.config.retryCount),
      catchError(this.errorHandler.handleError)
    );
  }
  modelFindByPkSeries(data) {
    return this.http.get(this.config.API_URL_ROOT + "api/vehicle/model/" + data).pipe(
      retry(this.config.retryCount),
      catchError(this.errorHandler.handleError)
    );
  }
}
