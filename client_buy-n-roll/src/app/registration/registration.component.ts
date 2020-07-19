import { Component, OnInit, HostListener, OnDestroy, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HelperService } from "../_services/helper.service";
import { BreadcrumbService } from '../_services/breadcrumb.service';
import { MenuItem, SelectItem } from 'primeng/api';
import { fadeInRightOnEnterAnimation, fadeOutLeftOnLeaveAnimation, fadeInDownOnEnterAnimation, fadeOutUpOnLeaveAnimation } from 'angular-animations';
import { User } from '../_types/user.interface';
import { SellerType } from '../_types/oglas.interface';
import { Subscribable, Subscription, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TranslationList } from '../_services/translation.list';
import { debounceTime, map } from 'rxjs/operators';
import { UserService } from '../_services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LocationPropComponent } from '../props/location-prop/location-prop.component';
import { PolicyComponent } from '../policy/policy.component';
import { NgModel, ValidationErrors } from '@angular/forms';
import { Config } from 'src/environments/config';
import { FileUpload } from 'primeng/fileupload';
import { AccConfirmComponent } from './acc-confirm/acc-confirm.component';
@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.scss"],
  animations: [
    fadeInRightOnEnterAnimation(),
    fadeOutLeftOnLeaveAnimation(),
    fadeInDownOnEnterAnimation(),
    fadeOutUpOnLeaveAnimation()
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
  progressVal:number = null;

  keyUp = new Subject<KeyboardEvent>();
  keyUpUsername = new Subject<KeyboardEvent>();
  keyUpSub:Subscription;
  keyUpUsernameSub:Subscription;

  payload: File;
  @ViewChild("fp") FileUploader: FileUpload;


  @ViewChild('locationProp') locationProp: LocationPropComponent;
  @ViewChild('policyRef') policyRef: PolicyComponent;

  @ViewChild('phoneInput') phoneInput:NgModel;
  @ViewChild('emailInput') emailInput:NgModel;
  @ViewChild('inputFirstName') firstNameInput:NgModel;
  @ViewChild('inputLastName') lastNameInput:NgModel;
  @ViewChild('passInput') passInput:NgModel;
  @ViewChild('passCheckInput') passCheckInput:NgModel;
  @ViewChild('usernameInput') usernameInput:NgModel;
  @ViewChild('confirmAcc') confirmAcc: AccConfirmComponent;

  registrationSuccess:boolean = false;
  
  constructor(
    private route: ActivatedRoute,
    public helperService: HelperService,
    private router:Router,
    private breadcrumbService: BreadcrumbService,
    private translate: TranslateService,
    private translateProvider: TranslationList,
    private userService: UserService,
    private loader:NgxUiLoaderService,
    private config:Config

  ) {}
  ngOnDestroy(): void {
    this.translateSubscription$.unsubscribe();
    this.keyUpSub.unsubscribe();
    this.keyUpUsernameSub.unsubscribe();
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
    this.setupDebounceUsernameKeys();
  }

  @HostListener("window:resize") updateOrientationState() {
    this.displayAccessories =
      this.helperService.getScreenY() < 450 ? false : true;
  }

  setupBreadcrumbs() {
    let prevRoute = this.route.snapshot.data.pageData[0] || '/';
    this.path = this.router.config.map(c => c.path).find(c => prevRoute.includes(c.split('/')[0]))?.split('/')[0];
    this.returnUrl = prevRoute;
    if(prevRoute != '/' && this.path) {
      this.breadcrumbs = this.breadcrumbService.basicMenu('REGISTRATION', this.breadcrumbService.determinePath());
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
      this.selectedSellerType = this.selectedSellerType ?? {
        value: st,
        label: this.translations[st],
      };
      return {
        value: st,
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
      this.userModel.username?.length >= 4 ? true: null,
      this.userModel.password == this.userModel.passwordCheck? true : null,
      this.phoneInput?.control.status == 'VALID' ? true : null,
      this.emailInput?.control.status == 'VALID' ? true : null,
    ].every(e => e != null)
  }
  checkIfEqual() {
    if(this.passInput.control.pristine == true || this.passCheckInput.control.pristine == true) {
      return false;
    }
    if(this.hasError(this.passInput) == true && this.hasError(this.passCheckInput) == true) {
      let result = this.userModel.password == this.userModel.passwordCheck? true : false;
      if(result == true) {
        this.passCheckInput.control.setErrors(null);
        return true;
      } else {
        this.passCheckInput.control.setErrors({ pw: 'ERROR' } as ValidationErrors);
        return false;
      }
    }
    return false;
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
  setupDebounceUsernameKeys() {
    this.keyUpUsernameSub = this.keyUpUsername.pipe(
      map(event => event),
      debounceTime(400),
    ).subscribe(res => {
      this.loader.startBackgroundLoader('registration_loader');
      this.checkUsername();
    });
  }

  checkUsername() {
    if(this.userModel.username && this.userModel.username.length > 3) {
      this.userService.checkUniqueUsername({username: this.userModel.username}).subscribe(result => {
        this.usernameInput.control.setErrors(null);
        this.loader.stopBackgroundLoader('registration_loader');

      }, err => {
        this.usernameInput.control.setErrors({uniqueUsername: 'ERROR'});
        console.log(this.usernameInput);
        
        this.loader.stopBackgroundLoader('registration_loader');
      });
    } 
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
    if(this.locationProp.displayDlgLocations == true) {
      this.location.selectedLocation = $event;
      this.location.search = this.location.selectedLocation.display_name;
    }
    this.locationProp.displayDlgLocations = false;
    
  }
  logger(data) {
    console.log(data);
    
  }

  openPolicy(key) {
    
    if(key == 'PRIVACY') {
      this.policyRef.displayDlgPolicy = true;
    }
    else if (key == 'TERMS_CONDITIONS') {
      this.policyRef.displayDlgTerms = true;
    }
  }
  incLoader() {
    if(this.progressVal > 98) {
      return;
    }
    this.progressVal+=1;
    setTimeout(() => {
      this.incLoader();
    }, 200);
  }

  registerUser() {
    this.userModel.sellerType = this.selectedSellerType.value;
    this.progressVal = 4;
    this.incLoader();
    let params = {
      ...this.userModel,
      ...this.location.selectedLocation
    };
    console.log(params);
    this.userService.registerUserStepOne(params).subscribe(async resOne => {
      this.progressVal = 50;
      if(this.payload && this.FileUploader.files?.length > 0) {
        await this.uploadImageToApi();
      }
      this.userService.registerUserStepTwo({username:this.userModel.username, lang:this.translate.currentLang}).subscribe(resTwo => {
        this.progressVal = 100;
        this.registrationSuccess = true;
      }, err => {
      });
    }, err => {

    });
    
  }
  goToLogin(event){
    setTimeout(() => {
      this.router.navigate(['/login'] , { skipLocationChange: true });
    }, 400);
  }

  cancelUpload() {
    this.FileUploader.clear();
    this.payload = null;
  }

  onUpload(event) {
    console.log(event);
    this.payload = event.files[0];
    console.log(this.payload);
    let img = document.getElementById('uploaded_img') as HTMLElement;
    img.setAttribute('style', `background-image: url('${URL.createObjectURL(this.payload)}')`);
  }

  uploadImageToApi() {
    return new Promise((resolve,reject) => {
      this.userService.uploadImage(this.payload, this.userModel.username).subscribe(data => {
          resolve();
        },err => {
          reject();
        });
    });
  }

}
