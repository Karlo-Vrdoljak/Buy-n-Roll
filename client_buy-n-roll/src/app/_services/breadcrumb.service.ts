import { Injectable, OnInit, OnDestroy } from "@angular/core";
import { MenuItem } from "primeng/api/menuitem";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { HelperService } from './helper.service';

@Injectable({
  providedIn: "root",
})
export class BreadcrumbService {
  private translateSubscription$: Subscription;
  private translations: any;
  constructor(private translate: TranslateService, private helperService: HelperService) {}

  catalogue() {
    return [
      {
        label: this.translate.instant("CATALOGUE"),
      },
    ] as MenuItem[];
  }

  catalogueItem(oglasNaziv:string, prevRoute?: MenuItem) {
    let menu = [] as MenuItem[];
    if (prevRoute) {
      menu.push(prevRoute);
    }
    menu.push({
        label: oglasNaziv,
    });
    return menu;
  }

  basicMenu(activatedPage: string, prevRoute?: MenuItem, detail:string = '') {    
    let menu = [] as MenuItem[];
    if (prevRoute) {
      menu.push(prevRoute);
    }
    menu.push({
      label: this.translate.instant(activatedPage) + detail,
    });
    return menu;
  }
  determinePath() {
    return {
      label: this.translate.instant("BACK"),
      command: () => window.history.back()
    } as MenuItem;
  }
}
