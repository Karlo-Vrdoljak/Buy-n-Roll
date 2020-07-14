import { Injectable, HostListener } from '@angular/core';
import { Config } from 'src/environments/config';
import { HelperService } from './helper.service';

@Injectable()
export class BaseClass {

  displayAccessories:boolean = true;

  constructor(
    public config:Config,
    public helperService: HelperService
  ) { }

  @HostListener("window:resize") updateOrientationState() {
    this.displayAccessories = this.helperService.getScreenY() < 450? false: true;
  }
}
