import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { HTTPErrorCodes } from "../_types/http.error.codes";
import { ToastrService } from "ngx-toastr";
import { Observable, throwError, of } from "rxjs";
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

  // handleError<T>(err) {
  //   // return (err: any): Observable<T> => {
  //     switch (err.status) {
  //       case HTTPErrorCodes.UNAUTHORIZED:
  //         this.toastr.error(HTTPErrorCodes.UNAUTHORIZED.toString(),err.statusText);
  //         return throwError(err);

  //       case HTTPErrorCodes.FORBIDDEN:
  //         this.toastr.error(HTTPErrorCodes.FORBIDDEN.toString(),err.statusText);
  //         return throwError(err);

  //       default:
  //         if (err.status == 0) {
  //           this.toastr.error("Check your internet connection!");
  //           return throwError(err);
  //         } else {
  //           this.toastr.error(err.status.toString(), err.statusText);
  //           return throwError(err);
  //         }
  //     }
  //   // };
  // }

  handleError(error: HttpErrorResponse) {
    //To know the version of RxJS npm list --depth=0 (I for this example im on version 5.5)
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred: ', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}` + ` body was: ${error.message}`
      );
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }


  public handleRouterState(state: RouterState) {
    this.router.navigateByUrl(state.snapshot.url);
    this.translate.get(["TRY_AGAIN", "ERROR"]).subscribe((tran) => {
      this.toastr.error(tran.TRY_AGAIN, tran.ERROR);
    });
  }
}
