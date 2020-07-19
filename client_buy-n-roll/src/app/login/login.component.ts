import { Component, OnInit, OnDestroy, HostListener, AfterViewInit, ViewChild } from "@angular/core";
import { MenuItem } from "primeng/api/menuitem";
import {  Router, ActivatedRoute } from "@angular/router";
import { BreadcrumbService } from "../_services/breadcrumb.service";
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../_services/user.service';
import { LocalStorageService } from 'angular-web-storage';
import { Config } from 'src/environments/config';
import { HelperService } from '../_services/helper.service';
import { fadeInRightOnEnterAnimation, fadeOutLeftOnLeaveAnimation } from 'angular-animations';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription, fromEvent, Subject, of } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, mergeMap, delay } from 'rxjs/operators';
import { AccConfirmComponent } from '../registration/acc-confirm/acc-confirm.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  animations: [
    fadeInRightOnEnterAnimation(),
    fadeOutLeftOnLeaveAnimation()
  ]
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit{
  breadcrumbs: MenuItem[];
  returnUrl:string;

  username:string;
  password:string;
  error:{
    username?:string;
    password?:string;
  }
  path:string;
  displayAccessories:boolean = true;
  translateSubscription$:Subscription;
  keyUp = new Subject<KeyboardEvent>();
  keyUpSub:Subscription;
  needsActivation:boolean = false;
  @ViewChild('confirmAcc') confirmAcc: AccConfirmComponent;
  constructor(
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute,
    private translate:TranslateService,
    private userService: UserService,
    private storage:LocalStorageService,
    private config:Config,
    private helperService: HelperService,
    public loader: NgxUiLoaderService,
    public toast:ToastrService


  ) {}
  ngAfterViewInit(): void {
    this.setupDebounceEnter();
  }

  @HostListener("window:resize") updateOrientationState() {
    this.displayAccessories = this.helperService.getScreenY() < 450? false: true;
  }

  ngOnDestroy(): void {
    this.translateSubscription$.unsubscribe();
    this.keyUpSub.unsubscribe();
   }

  ngOnInit(): void {
    this.updateOrientationState();
    this.setupBreadcrumbs();
    this.setupLangObservable();


  }
  login(fromEmitter = null) {
    if(fromEmitter != null) {
      this.error = null;
    }
    if(!this.username || !this.password) {
      return;
    }
    this.loader.startLoader('login_loader');
    this.userService.getToken({ username: this.username, password: this.password }).subscribe((data:any) => {
      
      this.error = null;
      let auth = {...data};
      this.storage.set('auth',auth);
      this.config.isLoggedIn = true;
      this.userService.checkToken(this.loader, 'login_loader').then((result) => {
        
        if(result == true) {
          let url = this.returnUrl ?? '/';
          if(url.includes('registration')) {
            url = '/';
          }
          setTimeout(() => {
            this.router.navigateByUrl(url);
          }, 300);
        }
        this.loader.stopLoader('login_loader');
      });
    }, err => {
      
      this.loader.stopLoader('login_loader');

      switch (err.statusText) {
        case 'BUYNROLL_ERR_USER_NOT_FOUND':{
          this.error = {
            username: err.statusText
          }
          break;
        }
        case 'BUYNROLL_ERR_WRONG_PASSWORD':{
          this.error = {
            password: err.statusText
          };
          break;
        }
        case 'BUYNROLL_ERR_USER_NOT_CONFIRMED_ACC':{
          this.error = {
            password: err.statusText
          };
          this.toast.warning(this.translate.instant(err.statusText));
          this.userService.registerUserStepTwo({username: this.username, lang: this.translate.currentLang}).subscribe(data => {
            this.needsActivation = true;
            if(this.confirmAcc) {
              this.confirmAcc.displayDlgAcc = true;
            }
          }, err => {
            this.needsActivation = false;
            this.error = null;
          });
          break;
        }
        default:
          break;
      }
    });
  }

  setupBreadcrumbs() {
    let prevRoute = this.route.snapshot.data.pageData;
    this.path = this.router.config.map(c => c.path).find(c => prevRoute.includes(c.split('/')[0]))?.split('/')[0];
    this.returnUrl = prevRoute;
    console.log(this.returnUrl);
    console.log(this.helperService.getLastNavigation());
    
    
    if(prevRoute != '/' && this.path) {
      this.breadcrumbs = this.breadcrumbService.basicMenu('LOGIN',this.breadcrumbService.determinePath());
    } else {
      this.breadcrumbs = this.breadcrumbService.basicMenu('LOGIN');
    }
  }

  private setupLangObservable() {
    this.translateSubscription$ = this.translate.onLangChange.subscribe(event => {
      this.setupBreadcrumbs();
    });
  }

  setupDebounceEnter() {
    this.keyUpSub = this.keyUp.pipe(
      map(event => event.keyCode),
      debounceTime(300),
    ).subscribe(res => this.login());
  }
}
