import { Injectable, OnInit, OnDestroy } from "@angular/core";
import { MenuItem } from "primeng/api/menuitem";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BreadcrumbService {
  private translateSubscription$: Subscription;
  private translations: any;
  constructor(private translate: TranslateService) {}

  catalogue() {
    return [
      {
        label: this.translate.instant("CATALOGUE"),
      },
    ] as MenuItem[];
  }

  login(prevRoute?: MenuItem) {
    let menu = [] as MenuItem[];
    if (prevRoute) {
      menu.push(prevRoute);
    }
    menu.push({
      label: this.translate.instant("LOGIN"),
    });
    return menu;
  }
  determinePath(route: string, fullPath?:string) {
    switch (route) {
      case "catalogues":
        console.log(fullPath);
        
        return {
          label: this.translate.instant("CATALOGUE"),
          url: fullPath? `/#${fullPath}`: `/${route}/`
        } as MenuItem;

      default:
        return null;
    }
  }
}
