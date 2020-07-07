import { Component, OnInit, HostListener } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HelperService } from "../_services/helper.service";
import { BreadcrumbService } from '../_services/breadcrumb.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.scss"],
})
export class RegistrationComponent implements OnInit {
  error: any;
  displayAccessories: boolean = true;
  translations: any;
  returnUrl: string;
  path: any;
  breadcrumbs: MenuItem[];
  constructor(
    private route: ActivatedRoute,
    public helperService: HelperService,
    private router:Router,
    private breadcrumbService: BreadcrumbService,

  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.data.pageData[0] || "";
    this.translations = this.route.snapshot.data.pageData[1] || {};
    console.log(this.returnUrl, this.translations);
    this.updateOrientationState();
    this.setupBreadcrumbs();
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
}
