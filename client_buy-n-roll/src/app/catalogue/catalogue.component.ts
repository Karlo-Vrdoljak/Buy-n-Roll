import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { BreadcrumbService } from "../_services/breadcrumb.service";
import { MenuItem } from "primeng/api/menuitem";
import { ActivatedRoute, Router, ActivationStart, NavigationEnd } from "@angular/router";
import { SelectItem } from "primeng/api/selectitem";
import { Subscription } from 'rxjs';
import { HelperService } from '../_services/helper.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: "app-catalogue",
  templateUrl: "./catalogue.component.html",
  styleUrls: ["./catalogue.component.scss"],
})
export class CatalogueComponent implements OnInit, OnDestroy {
  breadcrumbs: MenuItem[];
  catalogList: any[];
  sortOptions: SelectItem[];
  sortKey: string;
  sortField: string;
  sortOrder: number;
  routerSubscription$: Subscription;
  translateSubscription$:Subscription;
  displayAccessories:boolean = true;
  constructor(
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute,
    private router: Router,
    public helperService: HelperService,
    private translate:TranslateService
  ) {}

  @HostListener("window:resize") updateOrientationState() {
    console.log('alo');
    
    this.displayAccessories = this.helperService.getScreenY() < 450? false: true;
  }

  ngOnDestroy(): void {
    this.routerSubscription$.unsubscribe();
    this.translateSubscription$.unsubscribe();
  }

  ngOnInit(): void {
    this.breadcrumbs = this.breadcrumbService.catalogue();
    this.catalogList = this.route.snapshot.data.pageData[0] || [];
    this.routerSubscription$ = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.catalogList = [];
        this.catalogList = this.route.snapshot.data.pageData[0] || [];
      }
    });
    this.sortOptions = [
      { label: "Newest First", value: "!oglasCreatedAt" },
      { label: "Oldest First", value: "oglasCreatedAt" },
    ];
    this.setupLangObservable();
    this.updateOrientationState();
  }
  
  onSortChange(event) {
    let value = event.value;

    if (value.indexOf("!") === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  private setupLangObservable() {
    this.translateSubscription$ = this.translate.onLangChange.subscribe(event => {
      this.breadcrumbs = this.breadcrumbService.catalogue();
    });
  }
}
