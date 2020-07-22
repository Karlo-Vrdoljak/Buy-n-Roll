import { Injectable, HostListener, OnDestroy } from '@angular/core';
import { Config } from 'src/environments/config';
import { HelperService } from './helper.service';
import { Subscription, fromEvent } from 'rxjs';

@Injectable()
export class BaseClass implements OnDestroy {

  orientationSub:Subscription;
  displayAccessories:boolean = true;
  constructor(
    public config:Config,
    public helperService: HelperService
  ) {
    this.orientationSub = fromEvent(window,"resize").subscribe(() => this.updateOrientationState());
   }
  ngOnDestroy(): void {
    this.orientationSub?.unsubscribe();
  }

  updateOrientationState() {
    this.displayAccessories = this.helperService.getScreenY() < 450? false: true;
  }
}
