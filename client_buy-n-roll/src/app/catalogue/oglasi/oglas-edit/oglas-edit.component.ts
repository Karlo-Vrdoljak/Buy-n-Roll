import { Component, OnInit, OnDestroy, HostListener, ViewChild, ViewChildren } from '@angular/core';
import { BaseClass } from 'src/app/_services/base.class';
import { Config } from 'src/environments/config';
import { HelperService } from 'src/app/_services/helper.service';
import { BreadcrumbService } from 'src/app/_services/breadcrumb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgsRevealService } from 'ngx-scrollreveal';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserService } from 'src/app/_services/user.service';
import { ToastrService } from 'ngx-toastr';
import { TranslationList } from 'src/app/_services/translation.list';
import { Subscription, Subject } from 'rxjs';
import * as rfdc from 'rfdc';
import { SelectItem } from 'primeng/api';
import { PaymentMethod, GasTypes, VehicleState } from 'src/app/_types/oglas.interface';
import { fadeInRightOnEnterAnimation, fadeOutLeftOnLeaveAnimation } from 'angular-animations';
import { debounceTime, map } from 'rxjs/operators';
import { LocationPropComponent } from 'src/app/props/location-prop/location-prop.component';
import { Color, Body, Drivetrain, Transmission, Manufacturer, Series, Model } from 'src/app/_types/manufacturer.interface';
import { VehicleService } from 'src/app/_services/vehicle.service';
import { resolve } from 'dns';
import { Dropdown } from 'primeng/dropdown';

@Component({
  selector: 'app-oglas-edit',
  templateUrl: './oglas-edit.component.html',
  styleUrls: ['./oglas-edit.component.scss'],
  animations: [
    fadeInRightOnEnterAnimation(),
    fadeOutLeftOnLeaveAnimation()
  ]
})
export class OglasEditComponent extends BaseClass implements OnInit, OnDestroy {
  routerSub: Subscription;
  profileData: any;
  path: string;
  translations: any;
  oglas: any;
  returnUrl: string;
  breadcrumbs: any;
  translateSub: Subscription;
  oglasModel: any;
  currencyList:SelectItem[];
  iMaskMainCurrency = {
    mask: '000000000000000'

  }
  iMaskSubCurrency = {
    mask: '00'
  }
  iMaskInt = {
    mask: Number,
    scale:0
  }
  pageIndex = 0;
  paymentMethodList:SelectItem[];
  gasTypeList:SelectItem[];
  textAreaMaxLength = this.config.textAreaMaxLength * 4;
  loginSub: Subscription;
  @ViewChild('locationProp') locationProp: LocationPropComponent;
  keyUp = new Subject<KeyboardEvent>();
  keyUpSub: Subscription;
  vehicleStateList: SelectItem[];

  colorList:Color[];
  bodyList: Body[];
  drivetrainList: Drivetrain[];
  transmissionList: Transmission[];
  manufList: Manufacturer[];
  series: Series[];
  models: Model[];

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
    private translationProvider: TranslationList,
    private vehicleService: VehicleService
  ) { 
    super(config,helperService);
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    this.translateSub?.unsubscribe();
    this.loginSub?.unsubscribe();
    this.keyUpSub?.unsubscribe();
  }

  ngOnInit(): void {
    console.log(this.route.snapshot.data.pageData);
    
    this.profileData = this.route.snapshot.data.pageData[0] || [];
    this.path = this.route.snapshot.data.pageData[1] || '';
    this.translations = this.route.snapshot.data.pageData[2] || {}; 
    this.oglas = this.route.snapshot.data.pageData[3] || [];
    this.currencyList = this.initCurrencyList(this.route.snapshot.data.pageData[4] || []);
    this.colorList = this.route.snapshot.data.pageData[5] || [];
    this.bodyList = this.route.snapshot.data.pageData[6] || [];
    this.drivetrainList = this.route.snapshot.data.pageData[7] || [];
    this.transmissionList = this.route.snapshot.data.pageData[8] || [];
    this.manufList = this.route.snapshot.data.pageData[9] || [];

    this.setupOglasModel();
    this.setupLoginTracker();
    
    this.initPaymentMethod();
    this.initGasTypeList();
    this.initVehStateList();

    this.setupBreadCrumbs();
    this.setupLangObservable();
    this.updateOrientationState();
    this.handleOptionalLocation();
    this.setupDebounceKeys();

    this.oglasModel.selectedColor = this.oglasModel.vehicle.chassis.color ? this.colorList.find(cl => cl.PkColor == this.oglasModel.vehicle.chassis.color.PkColor) : null; 
    this.oglasModel.selectedBody = this.oglasModel.vehicle.chassis.model.body ? this.bodyList.find(b => b.PkBody == this.oglasModel.vehicle.chassis.model.body.PkBody) : null; 
    this.oglasModel.selectedDrivetrain = this.oglasModel.vehicle.chassis.model.drivetrain ? this.drivetrainList.find(d => d.PkDrivetrain == this.oglasModel.vehicle.chassis.model.drivetrain.PkDrivetrain) : null; 
    this.oglasModel.selectedTransmission = this.oglasModel.vehicle.chassis.model.transmission ? this.transmissionList.find(t=> t.PkTransmission == this.oglasModel.vehicle.chassis.model.transmission.PkTransmission) : null; 
    this.oglasModel.selectedManuf = this.oglasModel.vehicle.chassis.model.series.manufacturer ? this.manufList.find(m => m.PkManufacturer == this.oglasModel.vehicle.chassis.model.series.manufacturer.PkManufacturer) : null; 

    this.getSeries().then(() => {
      this.oglasModel.selectedSeries = this.oglasModel.vehicle.chassis.model.series ? this.series.find(s => s.PkSeries == this.oglasModel.vehicle.chassis.model.series.PkSeries) : null; 
    }).then(() => {
      this.getModels().then(() => {
        this.oglasModel.selectedModel = this.oglasModel.vehicle.chassis.model ? this.models.find(m => m.PkModel == this.oglasModel.vehicle.chassis.model.PkModel) : null; 
      });
    });

    console.log(this.oglasModel);
    
  }

  setupLoginTracker() {
    this.loginSub = this.helperService.currentLogin.subscribe(event => {
      if(!this.config.user) {
        this.router.navigateByUrl(this.returnUrl);
      }
    });
  }
  setupOglasModel() {
    this.oglasModel = rfdc({proto:true})(this.oglas);
    this.oglasModel['selectedCurrency'] = this.currencyList.find(el =>  el.value.name.toLowerCase().includes(this.oglas.currencyName.toLowerCase()));
  }

  initCurrencyList(list:any[]) {
    return Object.values(list).map(item => {
      return {
        label: item.symbol + ' ' + item.name,
        value: {
          name: item.name,
          symbol: item.symbol
        }
      } as SelectItem;
    });
  }
  initPaymentMethod() {
    this.paymentMethodList = Object.values(PaymentMethod).map(pm => {
      return {
        label: this.translations[pm],
        value: pm
      } as SelectItem;
    });
    this.oglasModel.selectedPaymentMethod = this.paymentMethodList.find(pm => pm.value == this.oglasModel.paymentMethod);
  }
  initGasTypeList() {
    this.gasTypeList = Object.values(GasTypes).map(gt => {
      return {
        label: this.translations[gt],
        value: gt
      } as SelectItem;
    });
    if(!this.oglasModel.selectedGasType && this.oglasModel.vehicle.chassis.model.gasType?.gasType) {
      this.oglasModel.selectedGasType = this.gasTypeList.find(gt => gt.value == this.oglasModel.vehicle.chassis.model.gasType.gasType);
    }
  }
  initVehStateList() {
    this.vehicleStateList = Object.values(VehicleState).map(vs => {
      return {
        label: this.translations[vs],
        value: vs
      } as SelectItem;
    });
    if(!this.oglasModel.selectedVehicleState && this.oglasModel.vehicle.chassis?.vehicleState) {
      this.oglasModel.selectedVehicleState = this.vehicleStateList.find(vs => vs.value == this.oglasModel.vehicle.chassis.vehicleState);
    }
  }
  getSeries(reset = false) {
    return new Promise(resolve => {
      if(reset == true) {
        this.oglasModel.selectedSeries = null;
        this.series = null;
        this.oglasModel.selectedModel = null; 
        this.models = null;
      }
      
      this.loader.startBackgroundLoader('oglas_edit_loader');
      let sub = this.vehicleService.seriesFindByPkmanufacturer(this.oglasModel.selectedManuf.PkManufacturer).subscribe((res:any) => {
        console.log(res, this.oglasModel.selectedModel);
        
        this.series = res.series;

        this.loader.stopBackgroundLoader('oglas_edit_loader');
        resolve();
        
      }, err => {
        this.loader.stopBackgroundLoader('oglas_edit_loader');
        resolve();
      }, () => {
        sub.unsubscribe();
      });
    });  
  }

  getModels(reset = false) {
    return new Promise(resolve => {
      if(reset == true) {
        this.models = null;
        this.oglasModel.selectedModel = null;
      }

      this.loader.startBackgroundLoader('oglas_edit_loader');
      this.vehicleService.modelFindByPkSeries(this.oglasModel.selectedSeries.PkSeries).subscribe((res:any) => {
        this.models = res.models;
        this.loader.stopBackgroundLoader('oglas_edit_loader');
        resolve();

      },err => {
        this.loader.stopBackgroundLoader('oglas_edit_loader');
        resolve();
      });
    });
  }

  applyProp(prop:string,event:any) {
    this.oglasModel[prop] = event;
  }

  logger(i) { console.log(i);}
  
  setupBreadCrumbs() {
    let prevRoute = this.route.snapshot.data.pageData[1] || '/';
    this.path = this.router.config.map(c => c.path).find(c => prevRoute.includes(c.split('/')[0]))?.split('/')[0];
    
    this.returnUrl = prevRoute;
    if(prevRoute != '/' && this.path) {
      this.breadcrumbs = this.breadcrumbService.basicMenu('EMPTY_STRING',this.breadcrumbService.determinePath());
    } else {
      this.breadcrumbs = this.breadcrumbService.basicMenu('EMPTY_STRING', null, this.oglas.oglasNaziv);
    }
  }

  setupLangObservable() {
    this.translateSub = this.translate.onLangChange.subscribe(event => {
      this.setupBreadCrumbs();
      this.translate.get(this.translationProvider.getRegistration()).subscribe(data => {
        this.translations = data;
        this.initPaymentMethod();
        this.applyProp('selectedPaymentMethod',this.paymentMethodList.find(pm => pm.value == this.oglasModel.selectedPaymentMethod.value));
        
        this.initGasTypeList();
        this.applyProp('selectedGasType',this.gasTypeList.find(gt => gt.value == this.oglasModel.selectedGasType.value));

        this.initVehStateList();
        this.applyProp('selectedVehicleState',this.vehicleStateList.find(vs => vs.value == this.oglasModel.selectedVehicleState.value));


      });
    });
  }
  IncPage() {
    this.pageIndex += 1;
  }
  DecPage() {
    this.pageIndex -=1;
  }

  handleOptionalLocation() {
    if(!this.oglasModel.location?.display_name) {
      this.oglasModel.location = {};
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
  updateSelectedLocation($event) {
    this.loader.stopLoader('oglas_edit_loader');
    if(this.locationProp.displayDlgLocations == true) {
      this.oglasModel.location = $event;
    }
    this.locationProp.displayDlgLocations = false;
  }

  getLocation() {
    this.loader.startLoader('oglas_edit_loader');
    this.userService.getLocation({
      search: this.oglasModel.location.display_name,
      lang: this.translate.currentLang
    }).subscribe((data:any) => {
      this.locationProp.locationList = data;
      this.locationProp.displayDlgLocations = true;
      
      this.loader.stopLoader('oglas_edit_loader');
    },err => {
      this.locationProp.displayDlgLocations = false;
      this.loader.stopLoader('oglas_edit_loader');
    });
  }
  filterInt(prop:number | string) {
    console.log(typeof prop, prop, this.oglasModel.vehicle.chassis.consumption === prop);
    if(typeof prop === 'string') {
      prop = prop.replace(/\D/g,'');
      console.log(prop);
      
    }
    
  }
}
