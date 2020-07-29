import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Config } from 'src/environments/config';
import { retry, catchError } from 'rxjs/operators';
import { ErrorHandler } from './errorHandler';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private http: HttpClient,
    private config:Config,
    private errorHandler:ErrorHandler
  ) { }

  findOglasiBySearchQuery(data) {
    return this.http.get(this.config.API_URL_ROOT + "api/vehicle/search/" + data).pipe(
      retry(this.config.retryCount),
      catchError(this.errorHandler.handleError)
    );
  }
  findOglasiByManufSerieModel(data) {
    return this.http.get(this.config.API_URL_ROOT + "api/vehicle/search/detailed", { params: data }).pipe(
      retry(this.config.retryCount),
      catchError(this.errorHandler.handleError)
    );
  }
  findOglasiAdvancedQuery(data) {
    return this.http.get(this.config.API_URL_ROOT + "api/vehicle/search/advanced", { params: data }).pipe(
      retry(this.config.retryCount),
      catchError(this.errorHandler.handleError)
    );
  }
}
