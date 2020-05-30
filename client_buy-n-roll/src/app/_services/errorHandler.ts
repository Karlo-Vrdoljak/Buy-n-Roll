import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { HTTPErrorCodes } from "../_types/http.error.codes";
import { ToastrService } from "ngx-toastr";
import { Observable, throwError } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { Router, RouterState } from "@angular/router";
@Injectable({
  providedIn: "root",
})
export class ErrorHandler {
  constructor(
    private toastr: ToastrService,
    private translate: TranslateService,
    private router: Router
  ) {}

  handleError<T>(stack: string) {
    return (err: any): Observable<T> => {
      switch (err.status) {
        case HTTPErrorCodes.UNAUTHORIZED:
          this.toastr.error(HTTPErrorCodes.UNAUTHORIZED.toString(),err.statusText);
          return throwError(err);

        case HTTPErrorCodes.FORBIDDEN:
          this.toastr.error(HTTPErrorCodes.FORBIDDEN.toString(),err.statusText);
          return throwError(err);

        default:
          if (err.status == 0) {
            this.toastr.error("Check your internet connection!");
            return throwError(err);
          } else {
            this.toastr.error(err.status.toString(), err.statusText);
            return throwError(err);
          }
      }
    };
  }

  public handleRouterState(state: RouterState) {
    this.router.navigate([state.snapshot.url]);
    this.translate.get(["TRY_AGAIN", "ERROR"]).subscribe((tran) => {
      this.toastr.error(tran.TRY_AGAIN, tran.ERROR);
    });
  }
}
