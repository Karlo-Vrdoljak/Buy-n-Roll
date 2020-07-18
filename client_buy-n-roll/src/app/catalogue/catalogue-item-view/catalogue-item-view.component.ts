import { Component, OnInit, HostListener, AfterViewInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationEnd, ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'src/app/_services/breadcrumb.service';
import { HelperService } from 'src/app/_services/helper.service';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { NgsRevealService } from 'ngx-scrollreveal';
import { User } from 'src/app/_types/user.interface';
import { Photo } from 'src/app/_types/oglas.interface';
import { UserService } from 'src/app/_services/user.service';
import { Config } from 'src/environments/config';
import { CatalogueActionIconsComponent } from '../catalogue-action-icons/catalogue-action-icons.component';
@Component({
  selector: 'app-catalogue-item-view',
  templateUrl: './catalogue-item-view.component.html',
  styleUrls: ['./catalogue-item-view.component.scss']
})
export class CatalogueItemViewComponent implements OnInit, AfterViewInit {
  breadcrumbs: MenuItem[];
  routerSubscription$: Subscription;
  translateSubscription$:Subscription;
  oglas:any;
  displayAccessories:boolean = true;
  returnUrl:string;
  countUpOptions:any;
  price:number;
  delay:number[];
  profileData:User;
  hideContact:boolean = false;
  showEdit: boolean = false;
  loginSub: Subscription;
  @ViewChild('actionIcons') actionIcons: CatalogueActionIconsComponent;
  constructor(
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute,
    public router: Router,
    public helperService: HelperService,
    private translate:TranslateService,
    public revealService:NgsRevealService,
    private userService:UserService,
    private config:Config

  ) { }
  ngAfterViewInit(): void {

  }
  

  @HostListener("window:resize") updateOrientationState() {
    this.displayAccessories = this.helperService.getScreenY() < 450? false: true;
  }

  ngOnDestroy(): void {
    this.routerSubscription$.unsubscribe();
    this.translateSubscription$.unsubscribe();
    this.revealService.destroy();
    this.loginSub?.unsubscribe();
    
  }

  async ngOnInit() {
    this.oglas = this.route.snapshot.data.pageData[0] || null;
    await this.setupOglasUserData();
    
    this.setupLoggedInUserObservable();
    
    this.setupOglasData();

    this.setupBreadCrumbs();

    this.setupLangObservable();
    
    this.updateOrientationState();
  }

  private setupLoggedInUserObservable() {

    this.loginSub = this.helperService.currentLogin.subscribe(event => {
      if(this.config.user) {
        this.hideContact = this.config.user.username == this.profileData.username? true: false;
        this.showEdit = this.config.user.username == this.profileData.username? true: false;
      } else {
        this.hideContact = false;
        this.showEdit = false;
      }
      this.actionIcons?.reloadState(this.hideContact, this.showEdit);
    });

  }

  private async setupOglasUserData() {
    this.profileData = this.oglas.vehicle.user;
    this.userService.getUserPhoto(this.oglas.vehicle.user.username).subscribe(data => {
      this.profileData.photo = data.photo;
      this.handleProfilePicture();
    });
  }
  getPhotoUrlCss() {
    return (this.profileData.photo.PkPhoto != -1? this.config.STATIC_FILES + this.profileData.username + '/' + this.profileData.photo.filename : this.profileData.photo.path);
  }

  private handleProfilePicture() {
    if(!this.profileData.photo?.filename) {
      this.profileData.photo = {
        PkPhoto: -1,
        path: "assets/images/misc/noProfile.png"
      } as Photo;
    }
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
