import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { HelperService } from 'src/app/_services/helper.service';
import { BreadcrumbService } from 'src/app/_services/breadcrumb.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgsRevealService } from 'ngx-scrollreveal';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserService } from 'src/app/_services/user.service';
import { ToastrService } from 'ngx-toastr';
import { TranslationList } from 'src/app/_services/translation.list';
import { OglasService } from 'src/app/_services/oglas.service';
import { Config } from 'src/environments/config';
import { Subscription } from 'rxjs';
import { BaseClass } from 'src/app/_services/base.class';
import { UserCardComponent } from 'src/app/props/user-card/user-card.component';
import { CatalogueSearchItemComponent } from '../catalogue-search-item/catalogue-search-item.component';
import { DataView } from 'primeng/dataview';
import { OglasStatus } from 'src/app/_types/oglas.interface';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent  extends BaseClass implements OnInit, OnDestroy {
  routerSub: Subscription;
  translateSub: Subscription;
  users: any[];
  oglasi:any[];
  path: any;
  translations: any;
  returnUrl: any;
  breadcrumbs: any;
  @ViewChild('dv') dataView: DataView;
  @ViewChildren(UserCardComponent) searchItems: QueryList<UserCardComponent>;
  @ViewChildren(CatalogueSearchItemComponent) searchOglasi: QueryList<CatalogueSearchItemComponent>;
  sortOrder: number;
  sortField: string;
  sortOptions: { label: string; value: string; }[];
  selectedSortOption: any;
  usersProfileUsername: string;

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


  ngOnInit(): void {
    this.users = this.route.snapshot.data.pageData[0] || null;
    this.path = this.route.snapshot.data.pageData[1] || '';
    this.translations = this.route.snapshot.data.pageData[2] || {};
    this.setupOglasi();

    this.usersProfileUsername = this.route.snapshot.data.pageData[3]?.username || null;

    this.setupBreadCrumbs();
    this.updateOrientationState();

    this.setupRouterSub();
    this.setupSortOptions();
  }

  setupOglasi() {
    let oglasi = this.route.snapshot.data.pageData[3]?.oglasi || null;
    this.oglasi = this.helperService.filterOglas(oglasi);
  }


  setupRouterSub() {
    if (this.routerSub != null) {
      return;
    }
    this.routerSub = this.router.events.subscribe(async event => {
      if (event instanceof NavigationEnd) {
        this.users = this.route.snapshot.data.pageData[0] || null;
        this.path = this.route.snapshot.data.pageData[1] || '';
        this.translations = this.route.snapshot.data.pageData[2] || {};
        this.setupOglasi();
        this.usersProfileUsername = this.route.snapshot.data.pageData[3]?.username || null;
        this.setupBreadCrumbs();
        this.setupSortOptions();
        this.updateOrientationState();

      }
    });
  }

  removeOglasFromList(pkOglas:number) {
    this.oglasi = this.oglasi.filter(o => o.PkOglas != pkOglas);
    this.dataView._value = this.oglasi;
    this.dataView.value = this.oglasi;

  }
  
  setupBreadCrumbs() {
    let prevRoute = this.route.snapshot.data.pageData[1] || '/';
    this.path = this.router.config.map(c => c.path).find(c => prevRoute.includes(c.split('/')[0]))?.split('/')[0];
    this.returnUrl = prevRoute;
    if(prevRoute != '/' && this.path) {
      this.breadcrumbs = this.breadcrumbService.basicMenu('USER_FAV',this.breadcrumbService.determinePath());
    } else {
      this.breadcrumbs = this.breadcrumbService.basicMenu('USER_FAV');
    }
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

  setupSortOptions() {
    this.sortOptions = [
      { label: 'SORT_NEW_FIRST', value:  this.oglasi == null? "!createdAt" : "!favouritedAt" },
      { label: 'SORT_OLD_FIRST', value: this.oglasi == null?  "createdAt" :  "favouritedAt" },
    ];
    this.selectedSortOption = this.sortOptions[0];
    this.onSortChange({value: this.selectedSortOption}, false);
  }

  navigateProfile() {
    this.router.navigate(['profile', {username: this.usersProfileUsername}]);
  }

}
