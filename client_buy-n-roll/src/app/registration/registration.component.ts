import { Component, OnInit, HostListener, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HelperService } from "../_services/helper.service";
import { BreadcrumbService } from '../_services/breadcrumb.service';
import { MenuItem, SelectItem } from 'primeng/api';
import { fadeInRightOnEnterAnimation, fadeOutLeftOnLeaveAnimation } from 'angular-animations';
import { User } from '../_types/user.interface';
import { SellerType } from '../_types/oglas.interface';
import { Subscribable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TranslationList } from '../_services/translation.list';

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.scss"],
  animations: [
    fadeInRightOnEnterAnimation(),
    fadeOutLeftOnLeaveAnimation()
  ]
})
export class RegistrationComponent implements OnInit, OnDestroy {
  error: any;
  displayAccessories: boolean = true;
  translations: any;
  returnUrl: string;
  path: any;
  breadcrumbs: MenuItem[];

  userModel:User;
  selectedSellerType:SelectItem;
  sellerTypes:SelectItem[];

  translateSubscription$:Subscription;
  constructor(
    private route: ActivatedRoute,
    public helperService: HelperService,
    private router:Router,
    private breadcrumbService: BreadcrumbService,
    private translate: TranslateService,
    private translateProvider: TranslationList

  ) {}
  ngOnDestroy(): void {
    this.translateSubscription$.unsubscribe();

  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.data.pageData[0] || "";
    this.translations = this.route.snapshot.data.pageData[1] || {};
    this.userModel = this.defaultUserModel();
    this.sellerTypes = this.defaultSellerType();
    console.log(this.returnUrl, this.translations);
    this.updateOrientationState();
    this.setupBreadcrumbs();
    this.setupLangObservable();
  }

  @HostListener("window:resize") updateOrientationState() {
    this.displayAccessories =
      this.helperService.getScreenY() < 450 ? false : true;
  }

  setupBreadcrumbs() {
    let prevRoute = this.route.snapshot.data.pageData;
    this.path = this.router.config.map(c => c.path).find(c => prevRoute.includes(c.split('/')[0]))?.split('/')[0];
    this.returnUrl = prevRoute;
    if(prevRoute != '/' && this.path) {
      this.breadcrumbs = this.breadcrumbService.basicMenu('REGISTRATION', this.breadcrumbService.determinePath(this.path,this.returnUrl));
    } else {
      this.breadcrumbs = this.breadcrumbService.basicMenu('REGISTRATION');
    }
  }

  defaultUserModel() {
    return {
      userId: null,
      firstName: null,
      password: null,
      passwordCheck: null,
      lastName: null,
      username: null,
      isActive: null,
      userCode: null,
      createdAt: null,
      roles: null,
      phone: null,
      email: null,
      sellerType: null,
    } as User;
  }
  defaultSellerType() {
    return Object.values(SellerType).map(st => {
      console.log(st);
      
      return {
        value: this.translations[st],
        label: this.translations[st],
      } as SelectItem;
    });
  }
  checkSubmitReady() {
    return true;
  }
  
  private setupLangObservable() {
    this.translateSubscription$ = this.translate.onLangChange.subscribe(event => {
      this.setupBreadcrumbs();
      this.translate.get(this.translateProvider.getRegistration()).subscribe(t => {
        this.translations = t;
        this.sellerTypes = this.defaultSellerType();
      });
    });
  }
}
