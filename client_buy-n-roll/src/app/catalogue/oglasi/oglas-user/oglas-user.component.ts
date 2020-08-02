import { Component, OnInit, OnDestroy, HostListener, ViewChildren, QueryList, ViewChild, AfterViewInit } from '@angular/core';
import { BaseClass } from 'src/app/_services/base.class';
import { HelperService } from 'src/app/_services/helper.service';
import { BreadcrumbService } from 'src/app/_services/breadcrumb.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgsRevealService } from 'ngx-scrollreveal';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserService } from 'src/app/_services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Config } from 'src/environments/config';
import { User } from 'src/app/_types/user.interface';
import { Subscription } from 'rxjs';
import { TranslationList } from 'src/app/_services/translation.list';
import { CatalogueSearchItemComponent } from '../../catalogue-search-item/catalogue-search-item.component';
import { DataView } from 'primeng/dataview';
import { OglasService } from 'src/app/_services/oglas.service';
import { OglasStatus } from 'src/app/_types/oglas.interface';

@Component({
  selector: 'app-oglas-user',
  templateUrl: './oglas-user.component.html',
  styleUrls: ['./oglas-user.component.scss']
})
export class OglasUserComponent extends BaseClass implements OnInit, OnDestroy, AfterViewInit{
  path: string;
  returnUrl: any;
  breadcrumbs: any;
  profileData:User;
  translations:any;
  oglasi:any[];
  displayOglasi:any[];
  routerSub: Subscription;
  translateSub:Subscription;
  sortKey: string;
  sortField: string = '';
  sortOrder: number;
  @ViewChildren(CatalogueSearchItemComponent) searchItems: QueryList<CatalogueSearchItemComponent>; 
  @ViewChild('dv') catalog:DataView;
  sortOptions: { label: string; value: string; }[];
  selectedSortOption: any;
  currencyList: any;
  deletedOglasi:any[];
  
  oglasiNoDeleted: boolean = true;

  constructor(
    public config:Config,
    public helperService: HelperService,
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute,
    private router: Router,
    private translate:TranslateService,
    public revealService:NgsRevealService,
    private loader: NgxUiLoaderService,
    private userService:UserService,
    private toast:ToastrService,
    private translationProvider: TranslationList,
    private oglasService: OglasService
  ) { 
    super(config, helperService);
  }
  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    this.translateSub?.unsubscribe();
  }

  async ngAfterViewInit() { await this.calculateExchangeRateForSort(); }


  ngOnInit(): void {

    this.profileData = this.route.snapshot.data.pageData[0] || [];
    this.path = this.route.snapshot.data.pageData[1] || '';
    this.translations = this.route.snapshot.data.pageData[2] || {}; 
    this.setupOglasi();
    this.currencyList = this.route.snapshot.data.pageData[4] || [];

    this.setupBreadCrumbs();
    this.setupLangObservable();
    this.updateOrientationState();

    this.setupSortOptions();

    this.setupUserData();
  }

  setupOglasi() {
    this.oglasi = this.route.snapshot.data.pageData[3] || []; 
    console.log(this.oglasi);
    
    this.displayOglasi = this.oglasi.filter(o => o.status != OglasStatus.IZBRISAN);
    this.deletedOglasi = this.oglasi.filter(o =>  o.status == OglasStatus.IZBRISAN);
  }
  setupLangObservable() {
    this.translateSub = this.translate.onLangChange.subscribe(event => {
      this.setupBreadCrumbs();
      this.translate.get(this.translationProvider.getRegistration()).subscribe(data => {
        this.translations = data;
      });
    });
  }

  setupBreadCrumbs() {
    let prevRoute = this.route.snapshot.data.pageData[1] || '/';
    this.path = this.router.config.map(c => c.path).find(c => prevRoute.includes(c.split('/')[0]))?.split('/')[0];
    this.returnUrl = prevRoute;
    if(prevRoute != '/' && this.path) {
      this.breadcrumbs = this.breadcrumbService.basicMenu(this.config.user?.username == this.profileData.username? 'MOJI_OGLASI' : 'USER_OGLASI',this.breadcrumbService.determinePath());
    } else {
      this.breadcrumbs = this.breadcrumbService.basicMenu(this.config.user?.username == this.profileData.username? 'MOJI_OGLASI' : 'USER_OGLASI');
    }
  }

  setupUserData() {
    if (this.routerSub != null) {
      return;
    }
    this.routerSub = this.router.events.subscribe(async event => {
      if (event instanceof NavigationEnd) {
        
        this.profileData = this.route.snapshot.data.pageData[0] || [];
        this.path = this.route.snapshot.data.pageData[1] || '';
        this.translations = this.route.snapshot.data.pageData[2] || {}; 
        this.setupOglasi();
        this.currencyList = this.route.snapshot.data.pageData[4] || [];
        this.catalog.value = this.oglasi;
        this.catalog._value = this.oglasi;
    
        this.setupBreadCrumbs();
        this.setupLangObservable();
        this.updateOrientationState();
    
        this.setupSortOptions();
    
        await this.calculateExchangeRateForSort();

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
    if(!this.catalog?.value) return;
    this.catalog.value = await Promise.all(this.catalog._value = this.catalog.value.map(async e => {
      if(e.currencyName != "Euro") {
        let ex = await this.oglasService.getExchangeRate(Object.values(this.currencyList).find((cl:any) => cl.name == e.currencyName));
        e['priceEurSort'] = (Number.parseInt(e.priceMainCurrency) + (Number.parseInt(e.priceSubCurrency) / 100)) * (1 / (Object.values(ex)[0]));
      }
      else {
        e['priceEurSort'] = Number.parseInt(e.priceMainCurrency) + (Number.parseInt(e.priceSubCurrency) / 100);
      }
      return e;
    }));
  }

  setupSortOptions() {
    this.sortOptions = [
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

  
  navigateProfile() {
    this.router.navigate(['profile', {username: this.profileData.username}]);
  }


  toggleView() {
    this.oglasiNoDeleted = this.oglasiNoDeleted == true? false: true;
    if(this.oglasiNoDeleted) {
      this.displayOglasi = this.oglasi.filter(o => o.status != OglasStatus.IZBRISAN);
      return;
    }
    if(!this.oglasiNoDeleted) {
      this.displayOglasi = this.deletedOglasi;
    }
  }

}

    

