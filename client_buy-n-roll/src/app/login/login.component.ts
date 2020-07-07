import { Component, OnInit, OnDestroy, HostListener, AfterViewInit } from "@angular/core";
import { MenuItem } from "primeng/api/menuitem";
import {  Router, ActivatedRoute } from "@angular/router";
import { BreadcrumbService } from "../_services/breadcrumb.service";
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../_services/user.service';
import { LocalStorageService } from 'angular-web-storage';
import { Config } from 'src/environments/config';
import { HelperService } from '../_services/helper.service';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, OnDestroy{
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
  constructor(
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute,
    private translate:TranslateService,
    private userService: UserService,
    private storage:LocalStorageService,
    private config:Config,
    private helperService: HelperService

  ) {}

  @HostListener("window:resize") updateOrientationState() {
    this.displayAccessories = this.helperService.getScreenY() < 450? false: true;
  }

  ngOnDestroy(): void { }

  ngOnInit(): void {
    this.updateOrientationState();
    this.setupBreadcrumbs();

  }
  login() {
    this.userService.getToken({ username: this.username, password: this.password }).subscribe((data:any) => {
      this.error = null;
      let auth = {...data};
      this.storage.set('auth',auth);
      this.config.isLoggedIn = true;
      this.userService.checkToken().then(() => this.router.navigateByUrl(this.returnUrl ?? '/'));
    }, err => {
      if(err.statusText == 'BUYNROLL_ERR_USER_NOT_FOUND') {
        this.error = {
          username: err.statusText
        }
      } else {
        this.error = {
          password: err.statusText
        };
      }
    });
  }

  setupBreadcrumbs() {
    let prevRoute = this.route.snapshot.data.pageData;
    this.path = this.router.config.map(c => c.path).find(c => prevRoute.includes(c.split('/')[0]))?.split('/')[0];
    this.returnUrl = prevRoute;
    if(prevRoute != '/' && this.path) {
      this.breadcrumbs = this.breadcrumbService.basicMenu('LOGIN',this.breadcrumbService.determinePath(this.path,this.returnUrl));
    } else {
      this.breadcrumbs = this.breadcrumbService.basicMenu('LOGIN');
    }
  }

}
