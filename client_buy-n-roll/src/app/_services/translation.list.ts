import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationList {
  private catalogue:string[];
  private landing:string[];

  constructor() {
    this.catalogue = ["VEHICLE_SEARCH"];
    this.landing = ["FORM_ERROR_TWOCHAR","SIGNEDOUT_OK"];
  }

  getCatalogues() {
    return this.catalogue;
  }
  getLanding() {
    return this.landing;
  }
}