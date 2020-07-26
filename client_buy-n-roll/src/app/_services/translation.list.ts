import { Injectable } from '@angular/core';
import { PaymentMethod } from '../_types/oglas.interface';

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
    this.registration = ["PRIVATNA_OSOBA", "PODUZECE", "PHOTO_SAVED", "GOTOVINA","KARTICNO","NA_RATE","ZAMJENA", 'BENZIN', 'LPG', 'STRUJA', 'HIBRID', 'ETANOL', 'DIZEL', 'IZVRSNO', 'UREDNO', 'DOBRO', 'RABLJENO', 'LOSIJE', 'DIJELOVI', 'LOSE', 'KARAMBOLIRAN', 'CHANGES_SAVED','PHOTO_DELETE'];
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

