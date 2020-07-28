import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BaseClass } from '../_services/base.class';
import { Config } from 'src/environments/config';

import { HelperService } from '../_services/helper.service';
import { Subscription, Subject } from 'rxjs';
import { NavigationEnd, ActivatedRoute, Router } from '@angular/router';
import { MenuItem, SelectItem } from 'primeng/api';
import { BreadcrumbService } from '../_services/breadcrumb.service';
import { TranslateService } from '@ngx-translate/core';
import { NgsRevealService } from 'ngx-scrollreveal';
import { User } from '../_types/user.interface';
import { Photo, SellerType } from '../_types/oglas.interface';
import { fadeInRightOnEnterAnimation, fadeOutLeftOnLeaveAnimation, fadeInDownOnEnterAnimation, fadeOutUpOnLeaveAnimation } from 'angular-animations';
import * as rfdc from "rfdc";
import { debounceTime, map } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserService } from '../_services/user.service';
import { LocationPropComponent } from '../props/location-prop/location-prop.component';
import { NgModel } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslationList } from '../_services/translation.list';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [
    fadeInRightOnEnterAnimation(),
    fadeOutLeftOnLeaveAnimation(),
    fadeInDownOnEnterAnimation(),
    fadeOutUpOnLeaveAnimation()
  ]
})
export class ProfileComponent extends BaseClass implements OnInit, OnDestroy {

  routerSubscription$: Subscription = null;
  translateSubscription$:Subscription = null;

  breadcrumbs: MenuItem[];
  returnUrl:string;
  path:string;
  profileData:User;
  userModel:User;

  editMode:boolean = false;
  editModeImg: boolean = false;

  keyUp = new Subject<KeyboardEvent>();
  keyUpSub:Subscription;


  @ViewChild('locationProp') locationProp: LocationPropComponent;
  selectedSellerType:SelectItem;
  sellerTypes:SelectItem[];
  translations:any;

  keyUpUsername = new Subject<KeyboardEvent>();
  keyUpUsernameSub:Subscription;
  userSub:Subscription;

  @ViewChild('firstNameInput') firstNameInput: NgModel;
  @ViewChild('lastNameInput') lastNameInput: NgModel;
  @ViewChild('usernameInput') usernameInput: NgModel;
  @ViewChild('emailInput') emailInput: NgModel;
  @ViewChild('phoneInput') phoneInput: NgModel;
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
    this.routerSubscription$?.unsubscribe();
    this.translateSubscription$?.unsubscribe();
    this.revealService?.destroy();
    this.keyUpSub?.unsubscribe();
    this.keyUpUsernameSub?.unsubscribe();
    this.userSub?.unsubscribe();

  }

  ngOnInit(): void {
    this.profileData = this.route.snapshot.data.pageData[0] || [];
    this.path = this.route.snapshot.data.pageData[1] || '';
    this.translations = this.route.snapshot.data.pageData[2] || {}; 
    this.setupBreadCrumbs();
    this.setupLangObservable();

    this.setupUserData();
    this.updateOrientationState();

    this.setupLoggedInUserObservable();

    this.setupDebounceKeys();
  }

  private setupLoggedInUserObservable() {
    this.userSub = this.helperService.currentLogin.subscribe(event => {
      if(this.config.user && this.config.user.username != this.profileData.username || (!this.config.user)) {
        this.toggleEditMode(true);
      }
    });
  }
  private setupLangObservable() {
    this.translateSubscription$ = this.translate.onLangChange.subscribe(event => {
      this.setupBreadCrumbs();
      this.translate.get(this.translationProvider.getRegistration()).subscribe(data => {
        this.translations = data;
        this.sellerTypes = this.defaultSellerType();
      });
    });
  }

  setupBreadCrumbs() {
    let prevRoute = this.route.snapshot.data.pageData[1] || '/';
    this.path = this.router.config.map(c => c.path).find(c => prevRoute.includes(c.split('/')[0]))?.split('/')[0];
    this.returnUrl = prevRoute;
    if(prevRoute != '/' && this.path) {
      this.breadcrumbs = this.breadcrumbService.basicMenu('PROFILE',this.breadcrumbService.determinePath());
    } else {
      this.breadcrumbs = this.breadcrumbService.basicMenu('PROFILE');
    }
  }
    
    
  

  private setupUserData() {
    this.handleOptionalPhoto();
    this.handleOptionalLocation();
    console.log(this.profileData);
    if (this.routerSubscription$ != null) {
      return;
    }
    this.routerSubscription$ = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.profileData = this.route.snapshot.data.pageData[0] || [];
        this.setupBreadCrumbs();
        console.log(this.profileData);
        this.path = this.route.snapshot.data.pageData[1] || '';
        this.translations = this.route.snapshot.data.pageData[2] || {}; 
        this.handleOptionalPhoto();
        this.handleOptionalLocation();
        if(this.config.user && this.config.user.username != this.profileData.username || (!this.config.user)) {
          this.toggleEditMode(true);
        }
      }
    });
  }
  getPhotoUrlCss() {
    return 'url(' + (this.profileData.photo.PkPhoto != -1? this.config.STATIC_FILES + this.profileData.username + '/' + this.profileData.photo.filename : this.profileData.photo.path) + ')';
  }

  handleOptionalPhoto() {
    if(!this.profileData.photo?.filename) {
      this.profileData.photo = {
        PkPhoto: -1,
        path: "assets/images/misc/noProfile.png"
      } as Photo;
    }
  }
  handleOptionalLocation() {
    if(!this.profileData.location?.display_name) {
      this.profileData.location = {};
    }
  }

  toggleEditMode(reset = false) {
    this.userModel = rfdc({proto:true})(this.profileData);
    
    this.sellerTypes = this.defaultSellerType(true);
    if(reset == true) {
      this.editMode = false;
    } else {
      this.editMode = this.editMode == false? true: false;
    }
    
  }

  setupDebounceKeys() {
    this.keyUpSub = this.keyUp.pipe(
      map(event => event.keyCode),
      debounceTime(1250),
    ).subscribe(res => {
      this.getLocation();
    });
  }

  setupDebounceUsernameKeys() {
    this.keyUpUsernameSub = this.keyUpUsername.pipe(
      map(event => event),
      debounceTime(400),
    ).subscribe(res => {
      this.loader.startBackgroundLoader('profile_loader');
      this.checkUsername();
    });
  }

  checkUsername() {
    if(this.userModel.username && this.userModel.username.length > 3) {
      this.userService.checkUniqueUsername({username: this.userModel.username}).subscribe(result => {
        this.usernameInput.control.setErrors(null);
        this.loader.stopBackgroundLoader('profile_loader');

      }, err => {
        this.usernameInput.control.setErrors({uniqueUsername: 'ERROR'});
        this.loader.stopBackgroundLoader('profile_loader');
      });
    } 
  }


  defaultSellerType(initial = false) {
    
    return Object.values(SellerType).map(st => {
      if(initial == true) {
        this.selectedSellerType = {
          value: this.userModel.sellerType,
          label: this.translations[this.userModel.sellerType],
        };
      }
      return {
        value: st,
        label: this.translations[st],
      } as SelectItem;
    });
  }

  getLocation() {
    this.loader.startLoader('profile_loader');
    this.userService.getLocation({
      search: this.userModel.location.display_name,
      lang: this.translate.currentLang
    }).subscribe((data:any) => {
      this.locationProp.locationList = data;
      this.locationProp.displayDlgLocations = true;
      
      this.loader.stopLoader('profile_loader');
    },err => {
      this.locationProp.displayDlgLocations = false;
      this.loader.stopLoader('profile_loader');
    });
  }

  updateSelectedLocation($event) {
    this.loader.stopLoader('profile_loader');
    if(this.locationProp.displayDlgLocations == true) {
      this.userModel.location = $event;
    }
    this.locationProp.displayDlgLocations = false;
  }
  toggleImageEdit() {
    this.editModeImg = this.editModeImg == true? false: true;
  }

  checkSubmitReady() : boolean {
    this.userModel.sellerType = this.selectedSellerType.value;
    return [
      this.helperService.objectEquals(this.userModel, this.profileData) == true? null : true,
      this.userModel.firstName || null,
      this.userModel.lastName || null,
      this.selectedSellerType ?? null,
      this.userModel.phone ?? null,
      this.userModel.email ?? null,
      this.phoneInput?.control.status == 'VALID' ? true : null,
      this.emailInput?.control.status == 'VALID' ? true : null,
    ].every(e => e != null);
  }

  saveChanges() {
    this.userModel.sellerType = this.selectedSellerType.value;
    let params = {
      ...this.userModel,
    };
    this.loader.startLoader('profile_loader');
    this.userService.saveUserProfileEdit(params).subscribe(data => {
      this.toggleEditMode();
      this.syncUserProfile();
    }, err => {
      this.toggleEditMode();
      this.loader.stopLoader('profile_loader');
    });
    
  }
  syncUserProfile() {
    this.userService.findUserByUsername(this.profileData.username).subscribe((profile:any) => {
      this.profileData = profile;
      this.setupUserData();
      this.loader.stopLoader('profile_loader');
    }, err => {
      this.loader.stopLoader('profile_loader');
    });
  }

  uploadImageToApi(payload) {
    if(!payload) return;
    this.loader.startBackgroundLoader('profile_loader');
    this.userService.checkToken().then(result => {
      this.userService.uploadImage(payload, this.profileData.username).subscribe(data => {
        this.loader.stopBackgroundLoader('profile_loader');
        this.toast.success(this.translations.PHOTO_SAVED);
        this.syncUserProfile();
        this.helperService.dispatchUserLogin();
      },err => {
        this.loader.stopBackgroundLoader('profile_loader');
      });
    }).catch(rej => {
      this.loader.stopBackgroundLoader('profile_loader');
    });
  }

  resolveOglasListPage() {
    this.router.navigate(['oglasi'], {queryParams: {username: this.profileData.username}});
  }
  resolveFavourites() {
    this.router.navigate(['/catalogues/favourites/ads/', this.profileData.userId]);
  }
}
