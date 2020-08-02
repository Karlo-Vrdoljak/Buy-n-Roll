import { Component, OnInit, OnDestroy, HostListener, ViewChildren, QueryList, AfterViewInit, ViewChild } from "@angular/core";
import { BreadcrumbService } from "../_services/breadcrumb.service";
import { MenuItem } from "primeng/api/menuitem";
import { ActivatedRoute, Router, ActivationStart, NavigationEnd } from "@angular/router";
import { SelectItem } from "primeng/api/selectitem";
import { Subscription, fromEvent } from 'rxjs';
import { HelperService } from '../_services/helper.service';
import { TranslateService } from '@ngx-translate/core';
import { CatalogueSearchItemComponent } from './catalogue-search-item/catalogue-search-item.component';
import { TranslationList } from '../_services/translation.list';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DataView } from 'primeng/dataview';
import { OglasService } from '../_services/oglas.service';
import * as rfdc from 'rfdc';
import { Config } from 'src/environments/config';

@Component({
  selector: "app-catalogue",
  templateUrl: "./catalogue.component.html",
  styleUrls: ["./catalogue.component.scss"],
})
export class CatalogueComponent implements OnInit, OnDestroy, AfterViewInit {
  breadcrumbs: MenuItem[];
  catalogList: any[];
  sortOptions: SelectItem[];
  sortKey: string;
  sortField: string = '';
  sortOrder: number;
  routerSubscription$: Subscription;
  translateSubscription$:Subscription;
  displayAccessories:boolean = true;
  selectedSortOption:SelectItem;
  @ViewChildren(CatalogueSearchItemComponent) searchItems: QueryList<CatalogueSearchItemComponent>; 
  @ViewChild('dv') catalog:DataView;
  translations: any;
  currencyList: any;
  loginSub: Subscription;
  constructor(
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute,
    private router: Router,
    public helperService: HelperService,
    private translate:TranslateService,
    private loader: NgxUiLoaderService,
    private oglasService: OglasService,
    private config:Config
  ) {}
  async ngAfterViewInit() { 
    await this.calculateExchangeRateForSort(); 
    this.setupCatalogList();

  }

  @HostListener("window:resize") updateOrientationState() {
    this.displayAccessories = this.helperService.getScreenY() < 450? false: true;
  }

  ngOnDestroy(): void {
    this.routerSubscription$?.unsubscribe();
    this.translateSubscription$?.unsubscribe();
    this.loginSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.breadcrumbs = this.breadcrumbService.catalogue();
    this.catalogList = this.route.snapshot.data.pageData[0] || [];
    this.catalogList = this.helperService.filterCatalogOglas(this.catalogList);

    this.currencyList = this.route.snapshot.data.pageData[2] || [];

    this.routerSubscription$ = this.router.events.subscribe(async event => {
      if (event instanceof NavigationEnd) {
        this.catalogList = this.route.snapshot.data.pageData[0] || [];
        this.currencyList = this.route.snapshot.data.pageData[2] || [];
        this.catalogList = this.helperService.filterCatalogOglas(this.catalogList);

        if(this.catalog) this.catalog._value = this.catalogList;
        if(this.catalog) this.catalog.value = this.catalogList;
        if(this.catalogList.length) await this.calculateExchangeRateForSort();
        this.setupCatalogList();
      }
    });

    this.setupSortOptions();
    this.setupLoginObs();
    this.setupLangObservable();
    this.updateOrientationState();
  }

  setupLoginObs() {
    this.loginSub = this.helperService.currentLogin.subscribe(event => {
      this.catalogList = this.helperService.filterCatalogOglas(this.catalogList);
    });

  }

  setupCatalogList() {
    if(!this.catalogList.length) return;
    
    this.catalogList = this.catalogList.filter(item => {
      if(![undefined, null].includes(item['filterCijenaMin'])) {
        
        if (item['priceEurSort'] >= item['filterCijenaMin'] && item['priceEurSort'] <= item['filterCijenaMax']) {
          return item;
        }
      } else {
        return item;
      }
    });
  }

  onSortChange(event, syncReaveal = true) {
    let sortOption = event.value as {label: string, value: string};

    if(syncReaveal == true) {
      this.searchItems.map(item => {
        item.syncScrollReveal();
      });
    }
    if (sortOption.value.indexOf("!") === 0) {
      this.sortOrder = -1;
      this.sortField = sortOption.value.slice(1);
    } else {
      this.sortOrder = 1;
      this.sortField = sortOption.value;
    }
  }

  async calculateExchangeRateForSort() {
    let result = await Promise.all(this.catalog.value.map(async e => {
      if(e.currencyName != "Euro") {
        let ex = await this.oglasService.getExchangeRate(Object.values(this.currencyList).find((cl:any) => cl.name == e.currencyName));
        e['priceEurSort'] = (Number.parseInt(e.priceMainCurrency) + (Number.parseInt(e.priceSubCurrency) / 100)) * (1 / (Object.values(ex)[0]));
      }
      else {
        e['priceEurSort'] = Number.parseInt(e.priceMainCurrency) + (Number.parseInt(e.priceSubCurrency) / 100);
      }
      return e;
    }));
    this.catalog.value = result;
    this.catalog._value = result;
  }
  setupSortOptions() {
    this.sortOptions = [
      { label: 'SORT_RELEVANT', value: "!score" },
      { label: 'SORT_NEW_FIRST', value: "!oglasCreatedAt" },
      { label: 'SORT_OLD_FIRST', value: "oglasCreatedAt" },
      { label: "SORT_SKUP_FIRST", value: "!priceEurSort"},
      { label: "SORT_JEFTIN_FIRST", value: "priceEurSort"},
      { label: "SORT_POPULARAN_FIRST", value: "!rating"},
      { label: "SORT_NEPOPULARAN_FIRST", value: "rating"},
    ]
    this.selectedSortOption = this.sortOptions[0];
    this.onSortChange({value: this.selectedSortOption}, false);
  }

  private setupLangObservable() {
    this.translateSubscription$ = this.translate.onLangChange.subscribe(event => {
      this.breadcrumbs = this.breadcrumbService.catalogue();
    });
  }
  openAdvancedSearch() {
    this.helperService.dispatchOpenAdvancedSearch(true);
  }
}
