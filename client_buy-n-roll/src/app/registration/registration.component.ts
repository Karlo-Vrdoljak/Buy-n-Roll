import { Component, OnInit, HostListener, OnDestroy, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HelperService } from "../_services/helper.service";
import { BreadcrumbService } from '../_services/breadcrumb.service';
import { MenuItem, SelectItem } from 'primeng/api';
import { fadeInRightOnEnterAnimation, fadeOutLeftOnLeaveAnimation } from 'angular-animations';
import { User } from '../_types/user.interface';
import { SellerType } from '../_types/oglas.interface';
import { Subscribable, Subscription, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TranslationList } from '../_services/translation.list';
import { debounceTime, map } from 'rxjs/operators';
import { UserService } from '../_services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LocationPropComponent } from '../props/location-prop/location-prop.component';
import { ImageUploaderOptions, FileQueueObject } from 'ngx-image-uploader-next';
import { PolicyComponent } from '../policy/policy.component';
import { NgModel } from '@angular/forms';
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
  location:{search:string;locationList:any;selectedLocation:any};

  translateSubscription$:Subscription;

  keyUp = new Subject<KeyboardEvent>();
  keyUpSub:Subscription;

  imageOptions: ImageUploaderOptions = {
    uploadUrl: 'https://fancy-image-uploader-demo.azurewebsites.net/api/demo/upload',
    cropEnabled: false,
    thumbnailResizeMode: 'fill',
    autoUpload: false,
    resizeOnLoad: false,
    thumbnailWidth: 100,
    thumbnailHeight: 100,
  };

  @ViewChild('locationProp') locationProp: LocationPropComponent;
  @ViewChild('policyRef') policyRef: PolicyComponent;

  @ViewChild('phoneInput') phoneInput:NgModel;
  @ViewChild('emailInput') emailInput:NgModel;
  @ViewChild('inputFirstName') firstNameInput:NgModel;
  @ViewChild('inputLastName') lastNameInput:NgModel;
  constructor(
    private route: ActivatedRoute,
    public helperService: HelperService,
    private router:Router,
    private breadcrumbService: BreadcrumbService,
    private translate: TranslateService,
    private translateProvider: TranslationList,
    private userService: UserService,
    private loader:NgxUiLoaderService

  ) {}
  ngOnDestroy(): void {
    this.translateSubscription$.unsubscribe();
    this.keyUpSub.unsubscribe();
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.data.pageData[0] || "";
    this.translations = this.route.snapshot.data.pageData[1] || {};

    this.location = this.defaultLocation();
    this.userModel = this.defaultUserModel();
    this.sellerTypes = this.defaultSellerType();
    this.updateOrientationState();
    this.setupBreadcrumbs();
    this.setupLangObservable();
    this.setupDebounceKeys();
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
      
      return {
        value: this.translations[st],
        label: this.translations[st],
      } as SelectItem;
    });
  }
  defaultLocation() {
    return {
      search: '',
      locationList: null,
      selectedLocation: null
    };
  }
  hasError(...items:NgModel[]) {
    if (items.every(i => i == undefined)) {
      return true;
    } 
    return items.map(i => i?.control.status == 'VALID' || i?.control.pristine == true ? true : null).every(e => e != null);
  }
  checkSubmitReady() : boolean {
    return [
      this.userModel.firstName ?? null,
      this.userModel.lastName ?? null,
      this.selectedSellerType ?? null,
      this.userModel.phone ?? null,
      this.userModel.email ?? null,
      this.userModel.username ?? null,
      this.userModel.passwordCheck ?? null,
      this.userModel.password ?? null,
      this.phoneInput?.control.status == 'VALID' ? true : null,
      this.emailInput?.control.status == 'VALID' ? true : null
      
    ].every(e => e != null)
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

  setupDebounceKeys() {
    this.keyUpSub = this.keyUp.pipe(
      map(event => event.keyCode),
      debounceTime(1250),
    ).subscribe(res => {
      this.loader.startBackgroundLoader('registration_loader');
      this.getLocation();
    });
  }

  getLocation() {

    this.userService.getLocation({
      search: this.location.search,
      lang: this.translate.currentLang
    }).subscribe((data:any) => {
      this.locationProp.locationList = data;
      this.locationProp.displayDlgLocations = true;
      
      this.loader.stopBackgroundLoader('registration_loader');
    },err => {
      this.location.locationList = null;
      this.locationProp.displayDlgLocations = false;
      this.loader.stopBackgroundLoader('registration_loader');
    });
  }
  updateSelectedLocation($event) {
    this.locationProp.displayDlgLocations = false;
    this.location.selectedLocation = $event;
    this.location.search = this.location.selectedLocation.display_name;
    
  }
  logger(data) {
    console.log(data);
    
  }

  onUpload(file: FileQueueObject) {
    console.log(file);
    
  }

  openPolicy(key) {
    
    if(key == 'PRIVACY') {
      this.policyRef.displayDlgPolicy = true;
    }
    else if (key == 'TERMS_CONDITIONS') {
      this.policyRef.displayDlgTerms = true;
    }
  }

}
