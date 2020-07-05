import { Component, OnInit, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationEnd, ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'src/app/_services/breadcrumb.service';
import { HelperService } from 'src/app/_services/helper.service';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { NgsRevealService } from 'ngx-scrollreveal';

@Component({
  selector: 'app-catalogue-item-view',
  templateUrl: './catalogue-item-view.component.html',
  styleUrls: ['./catalogue-item-view.component.scss']
})
export class CatalogueItemViewComponent implements OnInit {
  breadcrumbs: MenuItem[];
  routerSubscription$: Subscription;
  translateSubscription$:Subscription;
  oglas:any;
  displayAccessories:boolean = true;
  returnUrl:string;
  countUpOptions:any;
  price:number;
  delay:number[];
    
  constructor(
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute,
    private router: Router,
    public helperService: HelperService,
    private translate:TranslateService,
    public revealService:NgsRevealService

  ) { }

  @HostListener("window:resize") updateOrientationState() {
    this.displayAccessories = this.helperService.getScreenY() < 450? false: true;
  }

  ngOnDestroy(): void {
    this.routerSubscription$.unsubscribe();
    this.translateSubscription$.unsubscribe();
    this.revealService.destroy();

    
  }

  ngOnInit(): void {
    this.oglas = this.route.snapshot.data.pageData[0] || null;
    console.log(this.oglas);
    
    this.setupOglasData();

    this.setupBreadCrumbs();

    this.setupLangObservable();
    
    this.updateOrientationState();
  }

  private setupLangObservable() {
    this.translateSubscription$ = this.translate.onLangChange.subscribe(event => {
      this.breadcrumbs = this.breadcrumbService.catalogue();
    });
  }

  private setupBreadCrumbs() {
    let prevRoute = this.route.snapshot.data.pageData[1] || '/';
    let path = this.router.config.map(c => c.path).find(c => prevRoute.includes(c.split('/')[0])).split('/')[0];
    this.returnUrl = prevRoute;

    if(prevRoute != '/' && path) {
      this.breadcrumbs = this.breadcrumbService.catalogueItem(this.oglas.oglasNaziv, this.breadcrumbService.determinePath(path,this.returnUrl));
    } else {
      this.breadcrumbs = this.breadcrumbService.catalogueItem(this.oglas.oglasNaziv);
    }
    
    this.routerSubscription$ = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.oglas = null;
        this.oglas = this.route.snapshot.data.pageData[0] || null;
      }
    });
  }

  private setupOglasData() {
    this.countUpOptions = {
      decimalPlaces: 2,
      suffix: ` ${this.oglas.currencyName}`
    };
    this.price = Number(this.oglas.priceMainCurrency + '.' +  this.oglas.priceSubCurrency);
    
    this.delay = [80, 130, 210, 340, 550, 890];
  }

}
