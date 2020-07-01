import { Component, OnInit, OnDestroy } from "@angular/core";
import { MenuItem } from "primeng/api/menuitem";
import { Subscription } from "rxjs";
import { NavigationEnd, Router, ActivatedRoute, NavigationStart } from "@angular/router";
import { BreadcrumbService } from "../_services/breadcrumb.service";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, OnDestroy {
  breadcrumbs: MenuItem[];
  returnUrl:string;
  constructor(
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute,
    private translate:TranslateService
  ) {}

  ngOnDestroy(): void { }

  ngOnInit(): void {
    let prevRoute = this.route.snapshot.data.pageData;
    let path = this.router.config.map(c => c.path).find(c => prevRoute.includes(c.split('/')[0])).split('/')[0];
    this.returnUrl = prevRoute;
    if(prevRoute != '/' && path) {
      this.breadcrumbs = this.breadcrumbService.login(this.breadcrumbService.determinePath(path,this.returnUrl));
    } else {
      this.breadcrumbs = this.breadcrumbService.login();

    }
  }
}
