import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
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

@Component({
  selector: 'app-oglas-user',
  templateUrl: './oglas-user.component.html',
  styleUrls: ['./oglas-user.component.scss']
})
export class OglasUserComponent extends BaseClass implements OnInit, OnDestroy{
  path: string;
  returnUrl: any;
  breadcrumbs: any;
  profileData:User;
  translations:any;
  oglasi:any[];
  routerSub: Subscription;
  translateSub:Subscription;
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
    private translationProvider: TranslationList
  ) { 
    super(config, helperService);
  }
  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    this.translateSub?.unsubscribe();
  }

  ngOnInit(): void {
    console.log(
      this.route.snapshot.data.pageData
    );
    this.profileData = this.route.snapshot.data.pageData[0] || [];
    this.path = this.route.snapshot.data.pageData[1] || '';
    this.translations = this.route.snapshot.data.pageData[2] || {}; 
    this.oglasi = this.route.snapshot.data.pageData[3] || []; 
    this.setupBreadCrumbs();
    this.setupLangObservable();
    this.updateOrientationState();

    this.setupUserData();
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
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.profileData = this.route.snapshot.data.pageData[0] || [];
        this.setupBreadCrumbs();
        this.path = this.route.snapshot.data.pageData[1] || '';
        this.translations = this.route.snapshot.data.pageData[2] || {}; 
        this.oglasi = this.route.snapshot.data.pageData[3] || []; 
      }
    });
  }

}

    

