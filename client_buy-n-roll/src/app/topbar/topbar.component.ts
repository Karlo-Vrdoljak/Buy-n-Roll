import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Manufacturer, Series, Model, Color, Drivetrain, Transmission } from '../_types/manufacturer.interface';
import { VehicleService } from '../_services/vehicle.service';
import { fadeInUpOnEnterAnimation, fadeOutDownOnLeaveAnimation, fadeInRightOnEnterAnimation, fadeOutLeftOnLeaveAnimation } from 'angular-animations';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HelperService } from '../_services/helper.service';
import { searchTypes } from '../_types/misc';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TranslationList } from '../_services/translation.list';
import { LocalStorageService } from "angular-web-storage";
import { Config } from 'src/environments/config';
import { UserService } from '../_services/user.service';
import { Photo, VehicleState, GasTypes, SellerType } from '../_types/oglas.interface';
import { OglasService } from '../_services/oglas.service';
@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  animations: [
    fadeInUpOnEnterAnimation(),
    fadeOutDownOnLeaveAnimation(),
    fadeInRightOnEnterAnimation(),
    fadeOutLeftOnLeaveAnimation()
  ]
})
export class TopbarComponent implements OnInit, OnDestroy {
  displaySidebar:boolean = false;
  val = "asdf";
  landing:boolean = false;
  manufacturers:Manufacturer[];
  selectedManufacturer:Manufacturer;
  series:Series[];
  selectedSeries:Series;
  selectedModel:Model
  models:Model[];
  searchQuery:string;
  index:number = 0;
  translations:any;
  forbiddenIP:boolean = false;
  profilePhoto:any;
  displayAdvancedSearch: boolean = false;
  colors: any[];
  body: any[];
  drivetrain: any[];
  transmission: any[];
  advancedSearchProps: { Colors: any[]; Body: any[]; DriveTrain: any[]; Transmission: any[]; VehicleState: VehicleState[]; GasType: GasTypes[]; };
  loginSub: Subscription;
  searchSub: Subscription;
  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public vehicleService: VehicleService,
    public loader:NgxUiLoaderService,
    public helperService: HelperService,
    public toast:ToastrService,
    public translate: TranslateService,
    public translateProvider: TranslationList,
    public storage: LocalStorageService,
    public config:Config,
    public userService:UserService,
    public oglasService:OglasService

  ) { }
  ngOnDestroy(): void {
    this.loginSub?.unsubscribe();
    this.searchSub?.unsubscribe();
  }
  ngOnInit(): void {
    this.selectedManufacturer = null;
    this.selectedSeries = null;
    this.selectedModel = null;    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        if(this.activatedRoute.snapshot['_routerState'].url == '/') {
          this.landing = true;
        } else {
          this.landing = false;
        }
        if(['denied'].some(uri => this.router.routerState.snapshot.url.includes(uri))) {
          this.forbiddenIP = true;
        } else {
          this.forbiddenIP = false;
        }
      });
    forkJoin(
      this.vehicleService.manufacturersFindAll(),
      this.translate.get(this.translateProvider.getLanding()),
      this.oglasService.getColors(),
      this.oglasService.getBody(),
      this.oglasService.getDriveTrain(),
      this.oglasService.getTransmission()
    ).subscribe(([manufs, t, c, b, dt, tr]:[Manufacturer[], any, any[], any[], any[], any[]]) => {
      this.translations = t || {};
      this.manufacturers = manufs.map(m => {
        m.manufacturerName = m.manufacturerName.toLocaleLowerCase();
        m.manufacturerName = m.manufacturerName.charAt(0).toUpperCase() + m.manufacturerName.slice(1); 
        return m;
      });
      this.colors = c;
      this.body = b;
      this.drivetrain = dt;
      this.transmission = tr;
    });
    this.searchQuery = '';
    this.setupLoginObservable();
    this.setupAdvancedSearchObservable();
    // this.infLog();
  }
  setupLoginObservable() {
    this.loginSub = this.helperService.currentLogin.subscribe(event => {
      if(!this.config.user) {
        return;
      }
      this.userService.getUserPhoto(this.config.user?.username).subscribe(data => {
        if(!data?.photo) {
          this.profilePhoto = {
            PkPhoto: -1,
            path: "assets/images/misc/noProfile.png"
          } as Photo;
        } else {
          this.profilePhoto = data.photo;
        }
      });
    });
  }
  setupAdvancedSearchObservable() {
    this.searchSub = this.helperService.advancedSearchObservable.subscribe(event => {
      if(event) {
        this.openAdvancedSearch();
      }
    });
  }

  getSeriesData(event:any) {
    let manufacturer = event.value as Manufacturer;
    
    if(this.selectedManufacturer) {
      this.selectedManufacturer = null;
      this.series = null;
      this.selectedSeries = null;
      this.selectedModel = null;
      this.models = null;
    }
    this.selectedManufacturer = manufacturer;
    if(this.selectedManufacturer == null) {
      return;
    }
    this.loader.startBackgroundLoader('vehicleTopbar');
    this.vehicleService.seriesFindByPkmanufacturer(this.selectedManufacturer.PkManufacturer).subscribe((res:any) => {
      this.loader.stopBackgroundLoader('vehicleTopbar');
      this.series = res.series;
    },err => {
      this.loader.stopBackgroundLoader('vehicleTopbar');
    });
  }
  getModelData(event) {
    let series = event.value as Series;
    if(this.selectedSeries) {
      this.selectedSeries = null;
      this.models = null;
      this.selectedModel = null;
    }
    this.selectedSeries = series;
    if(this.selectedSeries == null) {
      return;
    }
    this.loader.startBackgroundLoader('vehicleTopbar');
    this.vehicleService.modelFindByPkSeries(this.selectedSeries.PkSeries).subscribe((res:any) => {
      this.models = res.models;
      this.loader.stopBackgroundLoader('vehicleTopbar');
    },err => {
      this.loader.stopBackgroundLoader('vehicleTopbar');
    });
  }

  selectModel(event) {
    let model = event.value as Model;
    if(this.selectedModel == model) {
      return;
    } else if (model == null) {
      this.selectedModel = null;
      return;
    }
    this.selectedModel = model;
  }

  openSidebar() {
    this.displaySidebar = this.displaySidebar == false? true: false;
  }
  logOff() {
    if(this.helperService.logOffRerouteUrl() == '/') {
      this.router.navigateByUrl('/');
    }
    this.config.user = null;
    this.config.isLoggedIn = false;
    this.storage.remove('auth');
    this.displaySidebar = false;
    this.toast.success(this.translations.SIGNEDOUT_OK,);
    this.helperService.loginSource.next(null);
  }
  rerouteOglas() {
    this.userService.checkToken().then(result => {
      if(result == true) {
        this.router.navigate(['/catalogues/oglas/new']);
        this.displaySidebar = false;
      } else {
        this.router.navigate(['/login'] , { skipLocationChange: true });
        this.displaySidebar = false;
      }
    });
  }
  onTabOpen(event) {
    this.index = event.index;
  }
  onTabClose(event) {
    
    this.index = event.index == 0? null: event.index;
  }
  search(searchType: number) {
    if(searchType == searchTypes.text) {
      let sanitizedQuery = this.helperService.sanitizeQuery(this.searchQuery);
      if(sanitizedQuery.length > 1) {
        this.router.navigate(["catalogues", sanitizedQuery], {queryParams: {searchType: searchType}});
        this.searchQuery = '';
        this.displaySidebar = false;
      } else {
        this.toast.info(this.translations.FORM_ERROR_TWOCHAR);
      }
    } else if (searchType == searchTypes.pickList) {
      if(this.selectedManufacturer && this.selectedSeries) {
        let params = {
          ...this.selectedManufacturer,
          ...this.selectedSeries,
          ...this.selectedModel? this.selectedModel: null
        }
        
        this.router.navigate(["catalogues", params], {queryParams: {searchType: searchType}});

        this.displaySidebar = false;
      }
    }
  }
  changeLang(lang:string) {
    this.storage.set("buynroll_lang",lang);
    this.translate.use(lang);
  }

  navigateProfile() {
    this.router.navigate(['profile', {username: this.config.user.username}]);
  }
  rerouteLogin() {
    this.router.navigate(['/login'], {skipLocationChange:true});

  }
  rerouteMojiOglasi() {
    this.router.navigate(['/oglasi/', {username: this.config.user.username}]);
  }
  rerouteFavourites() {
    this.router.navigate(['/catalogues/favourites/ads/', this.config.user.sub]);
    
  }

  openAdvancedSearch() {
    this.displayAdvancedSearch = true;
    this.advancedSearchProps = {
      Colors: this.colors,
      Body: this.body,
      DriveTrain: this.drivetrain,
      Transmission: this.transmission,
      VehicleState: Object.values(VehicleState),
      GasType: Object.values(GasTypes)
    };
  }
  onAdvancedSearch(event) {
    this.displayAdvancedSearch = false;
    this.advancedSearchProps = null;
    if(event) {
      this.router.navigate(["catalogues", event], {queryParams: {searchType: searchTypes.advanced}});
      this.displaySidebar = false;
    }
  }

}
