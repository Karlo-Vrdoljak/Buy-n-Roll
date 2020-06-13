import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  private translateSubscription$: Subscription;
  private translations:any;
  constructor(
    private translate: TranslateService,
  ) {
    this.init();
   }

  
   ngOnDestroy(): void {
    this.translateSubscription$.unsubscribe();
  }

  async init() {
    this.setupLangObservable();
    await this.getTranslations();
  }
  
  catalogue() {
    return [
      {
        label:this.translations.CATALOGUE
      }
    ] as MenuItem[];
  }

  private translationList(){
    return [
      "CATALOGUE"
    ]
  }
  private async getTranslations() {
    this.translate.get(this.translationList()).subscribe(data => {
      this.translations = data;
      console.log(this.translations);
      
    });
  }
  private setupLangObservable() {
    this.translateSubscription$ = this.translate.onLangChange.subscribe(event => this.getTranslations());
  }
}
