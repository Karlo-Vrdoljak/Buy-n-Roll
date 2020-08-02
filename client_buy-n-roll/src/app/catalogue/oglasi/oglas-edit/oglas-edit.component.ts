import { Component, OnInit, OnDestroy, HostListener, ViewChild, ViewChildren, AfterViewInit, QueryList, Input, Output, EventEmitter } from '@angular/core';
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
import { fadeInRightOnEnterAnimation, fadeOutLeftOnLeaveAnimation, fadeOutUpOnLeaveAnimation } from 'angular-animations';
import { debounceTime, map } from 'rxjs/operators';
import { LocationPropComponent } from 'src/app/props/location-prop/location-prop.component';
import { Color, Body, Drivetrain, Transmission, Manufacturer, Series, Model } from 'src/app/_types/manufacturer.interface';
import { VehicleService } from 'src/app/_services/vehicle.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgModel } from '@angular/forms';
import { OglasService } from 'src/app/_services/oglas.service';
@Component({
  selector: 'app-oglas-edit',
  templateUrl: './oglas-edit.component.html',
  styleUrls: ['./oglas-edit.component.scss'],
  animations: [
    fadeInRightOnEnterAnimation(),
    fadeOutLeftOnLeaveAnimation(),
    fadeOutUpOnLeaveAnimation()
  ]
})
export class OglasEditComponent extends BaseClass implements OnInit, OnDestroy, AfterViewInit {
  routerSub: Subscription;

  @Input('profileData') profileData: any;
  @Input('path') path: any;
  @Input('translations') translations: any;
  @Input('oglas') oglas: any;
  @Input('currencyList') currencyList:SelectItem[];
  @Input('colorList') colorList:Color[];
  @Input('bodyList') bodyList: Body[];
  @Input('drivetrainList') drivetrainList: Drivetrain[];
  @Input('transmissionList') transmissionList: Transmission[];
  @Input('manufList') manufList: Manufacturer[];

  returnUrl: string;
  breadcrumbs: any;
  translateSub: Subscription;
  oglasModel: any;
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

  series: Series[];
  models: Model[];
  numSlides:number = 5;

  swiperGalleryConfig:any;


  @ViewChild('oglasNazivInput') oglasNazivInput: NgModel;
  @ViewChild('vinInput') vinInput: NgModel;
  @ViewChild('priceMainCurrencyInput') priceMainCurrencyInput: NgModel;
  @ViewChild('priceSubCurrencyInput') priceSubCurrencyInput: NgModel;
  @ViewChild('selectedCurrencyInput') selectedCurrencyInput: NgModel;
  @ViewChild('selectedPaymentMethodInput') selectedPaymentMethodInput: NgModel;
  @ViewChild('consumptionInput') consumptionInput: NgModel;
  @ViewChild('kilometersInput') kilometersInput: NgModel;
  @ViewChild('selectedGasTypeInput') selectedGasTypeInput: NgModel;
  @ViewChild('makeYearInput') makeYearInput: NgModel;
  @ViewChild('selectedVehicleStateInput') selectedVehicleStateInput: NgModel;
  @ViewChild('selectedColorInput') selectedColorInput: NgModel;
  @ViewChild('selectedBodyInput') selectedBodyInput: NgModel;
  @ViewChild('selectedDrivetrainInput') selectedDrivetrainInput: NgModel; 
  @ViewChild('selectedTransmissionInput') selectedTransmissionInput: NgModel;

  @Input('editMode') editMode:boolean = true;
  @Output() onOglasCreateSuccess = new EventEmitter<boolean>();

  displayForm = true;
  
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
    private vehicleService: VehicleService,
    private oglasService: OglasService
  ) { 
    super(config,helperService);
  }
  ngAfterViewInit(): void { }
  
  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    this.translateSub?.unsubscribe();
    this.loginSub?.unsubscribe();
    this.keyUpSub?.unsubscribe();
  }

  ngOnInit(): void {

    if(this.editMode == true) {
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
    }
    
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
    this.oglasModel.selectedBody = this.oglasModel.vehicle.chassis.body ? this.bodyList.find(b => b.PkBody == this.oglasModel.vehicle.chassis.body.PkBody) : null; 
    this.oglasModel.selectedDrivetrain = this.oglasModel.vehicle.chassis.drivetrain ? this.drivetrainList.find(d => d.PkDrivetrain == this.oglasModel.vehicle.chassis.drivetrain.PkDrivetrain) : null; 
    this.oglasModel.selectedTransmission = this.oglasModel.vehicle.chassis.transmission ? this.transmissionList.find(t=> t.PkTransmission == this.oglasModel.vehicle.chassis.transmission.PkTransmission) : null; 
    this.oglasModel.selectedManuf = this.oglasModel.vehicle.chassis.model.series.manufacturer ? this.manufList.find(m => m.PkManufacturer == this.oglasModel.vehicle.chassis.model.series.manufacturer.PkManufacturer) : null; 

    if(this.oglasModel.vehicle.chassis.model.series.manufacturer.PkManufacturer) {
      this.getSeries().then(() => {
        this.oglasModel.selectedSeries = this.oglasModel.vehicle.chassis.model.series ? this.series.find(s => s.PkSeries == this.oglasModel.vehicle.chassis.model.series.PkSeries) : null; 
      }).then(() => {
        this.getModels().then(() => {
          this.oglasModel.selectedModel = this.oglasModel.vehicle.chassis.model ? this.models.find(m => m.PkModel == this.oglasModel.vehicle.chassis.model.PkModel) : null; 
        });
      });
    }

    this.swiperGalleryConfig = this.initSwiper();
  }

  initSwiper() {
    return {
      spaceBetween: 30,
      slidesPerView: this.numSlides,
      slidesPerGroup: this.numSlides,
      direction: 'horizontal',
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      grabCursor: true,
      mousewheel: true,
      speed: 1500,
      effect: 'slide',
      observer: true,
      observeParents: true,
      updateOnWindowResize: true,
      initialSlide: 0
    };
  }

  setupLoginTracker() {
    this.loginSub = this.helperService.currentLogin.subscribe(event => {
      if(!this.config.user) {
        this.router.navigateByUrl(this.returnUrl);
      }
    });
  }
  initOglasImages(photos) {
    return photos.map(p => {
      return {
        ...p,
        src: this.config.STATIC_FILES + this.profileData.username + '/' + p.filename,
        thumb: this.config.STATIC_FILES + this.profileData.username + '/' + p.filename,
        title: p.originalname
      }
    });
  }
  initDefaultOglasModel() {
    return {
      PkOglas: null,
      oglasNaziv: '',
      oglasOpis: '',
      oglasCreatedAt: null,
      lastModified: null,
      rating: 0,
      views: 0,
      priceMainCurrency: '',
      priceSubCurrency: '',
      currencyName: null,
      paymentMethod: null,
      autoRadioDefs: null,
      safety: null,
      accessories: null,
      theftSafety: null,
      airConditioning: null,
      comfortAccessories: null,
      photos: null,
      vehicle: {
        PkUserVehicle: null,
        RegistriranDaNe: false,
        user: null,
        chassis: {
          PkChassis: null,
          makeYear: null,
          VIN: null,
          kilometers: null,
          vehicleState: null,
          consumption: null,
          color: null,
          model: {
            PkModel: null,
            modelName: null,
            endOfProductionYear: null,
            series: {
              PkSeries: null,
              seriesName: null,
              manufacturer: {
                PkManufacturer: null,
                manufacturerName: null
              }
            }
          },
          drivetrain: {
            PkDrivetrain: null,
            drivetrainCode: null
          },
          transmission: {
            PkTransmission: null,
            transmissionName: null
          },
          gasType: {
            PkGasType: null,
            gasType: null
          },
          body: {
            PkBody: null,
            bodyName: null
          }
        }
      },
      location: {
        PkLocation: null,
        boundingbox: [],
        class: "",
        display_name: "",
        lat: "",
        lon: "",
        place_id: "",
        type: "",
      }
    };
  }
  setupOglasModel() {
    if(this.editMode == true) {
      this.oglasModel = rfdc({proto:true})(this.oglas);
      this.oglasModel['selectedCurrency'] = this.currencyList.find(el =>  el.value.name.toLowerCase().includes(this.oglas.currencyName.toLowerCase()));
      this.oglasModel.photos = this.initOglasImages(this.oglasModel.photos);
    } else {
      this.oglasModel = this.initDefaultOglasModel();
    }
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
    if(!this.oglasModel.selectedPaymentMethod && this.oglasModel.paymentMethod ) {
      this.oglasModel.selectedPaymentMethod = this.paymentMethodList.find(pm => pm.value == this.oglasModel.paymentMethod);
    }
  }
  initGasTypeList() {
    this.gasTypeList = Object.values(GasTypes).map(gt => {
      return {
        label: this.translations[gt],
        value: gt
      } as SelectItem;
    });
    if(!this.oglasModel.selectedGasType && this.oglasModel.vehicle.chassis.gasType?.gasType) {
      this.oglasModel.selectedGasType = this.gasTypeList.find(gt => gt.value == this.oglasModel.vehicle.chassis.gasType.gasType);
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
      this.breadcrumbs = this.breadcrumbService.basicMenu('EMPTY_STRING',this.breadcrumbService.determinePath(),this.oglas?.oglasNaziv ? this.oglas.oglasNaziv: this.translations.NOVI_OGLAS);
    } else {
      this.breadcrumbs = this.breadcrumbService.basicMenu('EMPTY_STRING', null, this.oglas?.oglasNaziv ? this.oglas.oglasNaziv: this.translations.NOVI_OGLAS);
    }
  }

  setupLangObservable() {
    this.translateSub = this.translate.onLangChange.subscribe(event => {
      this.setupBreadCrumbs();
      this.translate.get(this.translationProvider.getRegistration()).subscribe(data => {
        this.translations = data;
        
        if(this.oglasModel.selectedPaymentMethod) {
          this.initPaymentMethod();
          this.applyProp('selectedPaymentMethod',this.paymentMethodList.find(pm => pm.value == this.oglasModel.selectedPaymentMethod.value));
        }
        if(this.oglasModel.selectedGasType) {
          this.initGasTypeList();
          this.applyProp('selectedGasType',this.gasTypeList.find(gt => gt.value == this.oglasModel.selectedGasType.value));
        }
        if(this.oglasModel.selectedVehicleState) {
          this.initVehStateList();
          this.applyProp('selectedVehicleState',this.vehicleStateList.find(vs => vs.value == this.oglasModel.selectedVehicleState.value));
        }
      });
    });
  }
  IncPage() {
    this.pageIndex += 1;
  }
  DecPage() {
    this.pageIndex -=1;
  }
  capitalizeString() {
    if(this.oglasModel.vehicle.chassis.VIN) {
      this.oglasModel.vehicle.chassis.VIN = this.oglasModel.vehicle.chassis.VIN.toUpperCase();
    } else {
      return;
    }
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
    if(typeof prop === 'string') {
      prop = prop.replace(/\D/g,'');
    }
  }
  onImageUpload(images:File[]) {
    
    if(!images) return;
    this.loader.startLoader('oglas_edit_loader');
    this.userService.uploadImages(images,this.profileData.username, this.oglasModel.PkOglas).subscribe((data:any) => {
      this.oglasModel.photos = this.initOglasImages(data.photos);
      this.toast.success(this.translations.PHOTO_SAVED);
      this.loader.stopLoader('oglas_edit_loader');
    }, err => {
      this.loader.stopLoader('oglas_edit_loader');
    });
  }
  onImageDelete(pkImage: number) {
    this.loader.startLoader('oglas_edit_loader');
    this.userService.deleteImage(pkImage).subscribe((res:any) => {
      this.oglasModel.photos = this.initOglasImages(res.photos);
      this.loader.stopLoader('oglas_edit_loader');
      this.toast.success(this.translations.PHOTO_DELETE);
    }, err => {
      this.loader.stopLoader('oglas_edit_loader');
    });
  }

  canSubmit() {
    return [
      this.helperService.hasError(this.oglasNazivInput, this.vinInput, this.priceMainCurrencyInput, this.priceSubCurrencyInput, this.selectedCurrencyInput, this.selectedPaymentMethodInput,this.consumptionInput, this.kilometersInput, this.selectedGasTypeInput, this.makeYearInput, this.selectedVehicleStateInput, this.selectedColorInput, this.selectedBodyInput, this.selectedDrivetrainInput, this.selectedTransmissionInput),
      this.helperService.falsyCheck(this.oglasModel.oglasNaziv, this.oglasModel.priceMainCurrency, this.oglasModel.priceSubCurrency, this.oglasModel.selectedCurrency, this.oglasModel.selectedPaymentMethod, this.oglasModel.selectedManuf, this.oglasModel.selectedSeries, this.oglasModel.selectedModel, this.oglasModel.vehicle.chassis.consumption, this.oglasModel.vehicle.chassis.kilometers, this.oglasModel.selectedGasType, this.oglasModel.vehicle.chassis.makeYear, this.oglasModel.selectedVehicleState, this.oglasModel.selectedColor, this.oglasModel.selectedBody, this.oglasModel.selectedDrivetrain, this.oglasModel.selectedTransmission),
    ].every(e => e != false);
  }
  submitValues() {
    let params = {
      accessories: this.oglasModel.accessories ?? null,
      airConditioning: this.oglasModel.airConditioning ?? null,
      autoRadioDefs: this.oglasModel.autoRadioDefs ?? null,
      comfortAccessories: this.oglasModel.comfortAccessories ?? null,
      currencyName: this.oglasModel.selectedCurrency.value,
      oglasNaziv: this.oglasModel.oglasNaziv,
      oglasOpis: this.oglasModel.oglasOpis,
      paymentMethod: this.oglasModel.selectedPaymentMethod.value,
      priceMainCurrency: this.oglasModel.priceMainCurrency || '0',
      priceSubCurrency: this.oglasModel.priceSubCurrency || '0',
      safety: this.oglasModel.safety ?? null,
      theftSafety: this.oglasModel.theftSafety ?? null,
      selectedBody: this.oglasModel.selectedBody,
      selectedColor: this.oglasModel.selectedColor,
      selectedDrivetrain: this.oglasModel.selectedDrivetrain,
      selectedGasType: this.oglasModel.selectedGasType,
      selectedManuf: this.oglasModel.selectedManuf,
      selectedModel: this.oglasModel.selectedModel,
      selectedSeries: this.oglasModel.selectedSeries,
      selectedTransmission: this.oglasModel.selectedTransmission,
      vehicleState: this.oglasModel.selectedVehicleState.value,
      vin: this.oglasModel.vehicle.chassis.VIN || null,
      registriranDaNe: this.oglasModel.vehicle.RegistriranDaNe ?? false,
      consumption: this.oglasModel.vehicle.chassis.consumption || 0,
      kilometers: this.oglasModel.vehicle.chassis.kilometers || '0',
      makeYear: this.oglasModel.vehicle.chassis.makeYear || '0',
      location: this.oglasModel.location?.display_name? this.oglasModel.location: null,
      PkOglas: this.oglasModel.PkOglas,
      PkVehicle: this.oglasModel.vehicle.PkUserVehicle,
      PkChassis: this.oglasModel.vehicle.chassis.PkChassis
    };
    if(this.editMode == true) {
      this.loader.startBackgroundLoader('oglas_edit_loader');
      this.oglasService.saveOglasEditData(params).subscribe(data => {
        this.loader.stopBackgroundLoader('oglas_edit_loader');
        this.toast.success(this.translations.CHANGES_SAVED);
        this.router.navigate(['/catalogues/item/', this.oglasModel.PkOglas]);
      }, err => {
        this.loader.stopBackgroundLoader('oglas_edit_loader');
      });
    } else {
      this.loader.startLoader('oglas_edit_loader')
      this.oglasService.saveNewOglas(params).subscribe((data:any) => {
        
        this.displayForm = false;
        this.onOglasCreateSuccess.emit(true);
        this.oglasModel.photos = [];
        this.oglasModel.PkOglas = data.PkOglas;
        this.loader.stopLoader('oglas_edit_loader');
      }, err => {
        this.loader.stopLoader('oglas_edit_loader');
      });    
    }
  }

  finishOglasCreation() {
    this.router.navigate(['/oglasi/', {username: this.config.user.username}]);
  }
}
