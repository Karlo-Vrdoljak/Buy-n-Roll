import { Injectable, NgZone } from "@angular/core";
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
    public router: Router
  ) {}

  public handleError(error: HttpErrorResponse) {
    //To know the version of RxJS npm list --depth=0 (I for this example im on version 5.5)
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred: ", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}` + ` body was: ${error.message}`
      );
    }
    if (error.status == 429) {
      if (!window.location.href.includes("denied")) {
        window.location.replace(window.location.href.split('/#/')[0] + '/#/denied');
      }
    }
    // if (error.status == 401) {
    //   window.location.replace(window.location.href.split('/#/')[0] + '/#/');
    // }
    // return an observable with a user-facing error message
    // throw of('Something bad happened; please try again later.');
    return throwError(error);
  }

  public handleRouterState(state: RouterState,viewResolverDeny: boolean = false) {
    this.router.navigateByUrl(state.snapshot.url);
    if (viewResolverDeny == false) {
      this.translate.get(["TRY_AGAIN", "ERROR"]).subscribe((tran) => {
        this.toastr.error(tran.TRY_AGAIN, tran.ERROR);
      });
    }
  }
}
