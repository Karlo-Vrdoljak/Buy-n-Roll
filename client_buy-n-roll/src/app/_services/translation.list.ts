import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationList {
  private catalogue:string[];
  private landing:string[];
  private registration: string[];

  constructor() {
    this.catalogue = ["VEHICLE_SEARCH"];
    this.landing = ["FORM_ERROR_TWOCHAR","SIGNEDOUT_OK"];
    this.registration = ["PRIVATNA_OSOBA", "PODUZECE"];
  }

  getCatalogues() {
    return this.catalogue;
  }
  getLanding() {
    return this.landing;
  }
  getRegistration() {
    return this.registration;
  }
}