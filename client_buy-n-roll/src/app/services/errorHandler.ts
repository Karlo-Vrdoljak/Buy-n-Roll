import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { HTTPErrorCodes } from "../types/http.error.codes";
import { ToastrService } from "ngx-toastr";
@Injectable({
  providedIn: "root"
})
export class ErrorHandler {
  constructor(public toastr: ToastrService) {}

  handleError(err: HttpErrorResponse) {
    switch (err.status) {
      case HTTPErrorCodes.UNAUTHORIZED:
        this.toastr.error( HTTPErrorCodes.UNAUTHORIZED.toString(), err.statusText );
        break;
      case HTTPErrorCodes.FORBIDDEN:
        this.toastr.error( HTTPErrorCodes.FORBIDDEN.toString(), err.statusText );
        break;
      default:
        if(err.status == 0) {
          this.toastr.error( "Check your internet connection!" );
        } else {
          this.toastr.error( err.status.toString(), err.statusText );
        }

        break;
    }
  }
}
