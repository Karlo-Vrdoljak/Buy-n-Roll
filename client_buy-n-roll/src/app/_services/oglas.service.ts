import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Config } from 'src/environments/config';
import { retry, catchError } from 'rxjs/operators';
import { ErrorHandler } from './errorHandler';

@Injectable({
  providedIn: 'root'
})
export class OglasService {

  constructor(
    private http: HttpClient,
    private config:Config,
    private errorHandler:ErrorHandler
  ) { }

  findOglasByPk(data) {
    return this.http.get(this.config.API_URL_ROOT + "api/oglas/" + data).pipe(
      retry(this.config.retryCount),
      catchError(this.errorHandler.handleError)
    );
  }
  findOglasiByUsername(data) {
    return this.http.get(this.config.API_URL_ROOT + "user/oglasi/username/" + data).pipe(
      retry(this.config.retryCount),
      catchError(this.errorHandler.handleError)
    );
  }
  getColors() {
    return this.http.get(this.config.API_URL_ROOT + "api/vehicle/color/").pipe(
      retry(this.config.retryCount),
    );
  }
  getBody() {
    return this.http.get(this.config.API_URL_ROOT + "vehicle/body/").pipe(
      retry(this.config.retryCount),
    );
  }
  getDriveTrain() {
    return this.http.get(this.config.API_URL_ROOT + "vehicle/drivetrain/").pipe(
      retry(this.config.retryCount),
    );
  }
  getTransmission() {
    return this.http.get(this.config.API_URL_ROOT + "vehicle/transmission/").pipe(
      retry(this.config.retryCount),
    );
  }
  saveOglasEditData(params) {
    return this.http.post(this.config.API_URL_ROOT + 'api/oglas/edit/saveChanges/', params ).pipe(
      retry(this.config.retryCount),
      catchError(this.errorHandler.handleError)
    );
  }
  saveNewOglas(params) {
    return this.http.post(this.config.API_URL_ROOT + 'api/oglas/insert/', params ).pipe(
      retry(this.config.retryCount),
      catchError(this.errorHandler.handleError)
    );
  }
}
