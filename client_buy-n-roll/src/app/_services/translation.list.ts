import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationList {
  private catalogue:string[];

  constructor() {
    this.catalogue = ["VEHICLE_SEARCH"];
  }

  getCatalogues() {
    return this.catalogue;
  }
}