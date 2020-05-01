import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { HTTPErrorCodes } from "../_types/http.error.codes";
import { ToastrService } from "ngx-toastr";
@Injectable({
  providedIn: "root",
})
export class ErrorHandler {
  constructor(public toastr: ToastrService) {}

  handleError(err: HttpErrorResponse) {
    switch (err.status) {
      case HTTPErrorCodes.UNAUTHORIZED:
        this.toastr.error(HTTPErrorCodes.UNAUTHORIZED.toString(),err.statusText);
        throw err.statusText;

      case HTTPErrorCodes.FORBIDDEN:
        this.toastr.error(HTTPErrorCodes.FORBIDDEN.toString(), err.statusText);
        throw err.statusText;
      default:
        if (err.status == 0) {
          this.toastr.error("Check your internet connection!");
          throw err.statusText;
        } else {
          this.toastr.error(err.status.toString(), err.statusText);
          throw err.statusText;
        }
    }
  }
}
