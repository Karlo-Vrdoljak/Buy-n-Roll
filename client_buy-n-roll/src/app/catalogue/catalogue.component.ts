import { Component, OnInit, OnDestroy } from "@angular/core";
import { BreadcrumbService } from "../_services/breadcrumb.service";
import { MenuItem } from "primeng/api/menuitem";
import { ActivatedRoute, Router, ActivationStart, NavigationEnd } from "@angular/router";
import { SelectItem } from "primeng/api/selectitem";
import { Subscription } from 'rxjs';
import { HelperService } from '../_services/helper.service';

@Component({
  selector: "app-catalogue",
  templateUrl: "./catalogue.component.html",
  styleUrls: ["./catalogue.component.scss"],
})
export class CatalogueComponent implements OnInit, OnDestroy {
  breadcrumbs: MenuItem[];
  catalogList: any[];
  sortOptions: SelectItem[];
  sortKey: string;
  sortField: string;
  sortOrder: number;
  routerSubscription$: Subscription

  constructor(
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute,
    private router: Router,
    public helperService: HelperService
  ) {}

  ngOnDestroy(): void {
    this.routerSubscription$.unsubscribe();
  }

  ngOnInit(): void {
    this.breadcrumbs = this.breadcrumbService.catalogue();
    this.catalogList = this.route.snapshot.data.pageData[0] || [];
    this.routerSubscription$ = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.catalogList = [];
        this.catalogList = this.route.snapshot.data.pageData[0] || [];
      }
    });
    this.sortOptions = [
      { label: "Newest First", value: "!oglasCreatedAt" },
      { label: "Oldest First", value: "oglasCreatedAt" },
    ];
  }
  
  onSortChange(event) {
    let value = event.value;

    if (value.indexOf("!") === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }
}