import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Manufacturer, Series, Model } from 'src/app/_types/manufacturer.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { VehicleService } from 'src/app/_services/vehicle.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HelperService } from 'src/app/_services/helper.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { TranslationList } from 'src/app/_services/translation.list';
import { LocalStorageService } from 'angular-web-storage';
import { UserService } from 'src/app/_services/user.service';
import { Config } from 'src/environments/config';
import { fadeInUpOnEnterAnimation, fadeOutDownOnLeaveAnimation, fadeInRightOnEnterAnimation, fadeOutLeftOnLeaveAnimation } from 'angular-animations';
import { VehicleState, GasTypes } from 'src/app/_types/oglas.interface';
import { SelectItem } from 'primeng/api';
import * as rfdc from 'rfdc';

@Component({
  selector: "app-advanced-search",
  templateUrl: "./advanced-search.component.html",
  styleUrls: ["./advanced-search.component.scss"],
  animations: [
    fadeInUpOnEnterAnimation(),
    fadeOutDownOnLeaveAnimation(),
    fadeInRightOnEnterAnimation(),
    fadeOutLeftOnLeaveAnimation()
  ]
})
export class AdvancedSearchComponent implements OnInit {
  @Input("dialog") dialog: boolean = true;
  displayDlg: boolean = true;
  @Input('manufacturers') manufacturers: Manufacturer[];
  @Input('advancedSearchProps') advancedSearchProps: { Colors: any[]; Body: any[]; DriveTrain: any[]; Transmission: any[]; VehicleState: any[]; GasType: any[]; };
  selectedManufacturer: any = null;
  series: any;
  selectedSeries: any = null;
  selectedModel: any = null;
  models: any;
  searchModel:any = null;
  params:any = null;
  @Output() onAdvancedSearch = new EventEmitter<any>();
  maxYear:number;
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
    public userService:UserService
  ) {}

  ngOnInit(): void {
    this.maxYear = (new Date()).getFullYear();
    this.advancedSearchProps.GasType = this.advancedSearchProps.GasType.map(gt => {
      return {
        gasType:gt
      };
    });
    this.advancedSearchProps.VehicleState = this.advancedSearchProps.VehicleState.map(vs => {
      return {
        vehicleState:vs
      };
    });
    this.searchModel = this.initSearchModel();
  }
  checkCanSubmit() {
    return [
      this.searchModel.Colors ?? null,
      this.searchModel.Body ?? null,
      this.searchModel.DriveTrain ?? null,
      this.searchModel.Transmission ?? null,
      this.searchModel.VehicleState ?? null,
      this.searchModel.GasType ?? null,
      this.searchModel.Manufacturer ?? null,
      this.searchModel.Series ?? null,
      this.searchModel.Model ?? null,
      this.selectedManufacturer ?? null,
      this.selectedSeries ?? null,
      this.selectedModel ?? null,
      this.handleSlider(this.searchModel.kilometri, 'kilometri'),
      this.handleSlider(this.searchModel.godina, 'godina'),
      this.handleSlider(this.searchModel.potrosnja, 'potrosnja'),
      this.handleSlider(this.searchModel.cijena, 'cijena'),
    ].some(sm => sm != null);
  }

  EmitValue() {
    this.onAdvancedSearch.emit(this.params ?? null);
  }

  setSearchValues() {
    this.params = {
      bodyName: this.searchModel.Body?.bodyName ? this.searchModel.Body.bodyName : null,
      color: this.searchModel.Colors?.color ? this.searchModel.Colors.color : null,
      drivetrainCode: this.searchModel.DriveTrain?.drivetrainCode ? this.searchModel.DriveTrain.drivetrainCode : null,
      gasType: this.searchModel.GasType?.gasType ? this.searchModel.GasType.gasType : null,
      transmissionName: this.searchModel.Transmission?.transmissionName ? this.searchModel.Transmission.transmissionName : null,
      vehicleState: this.searchModel.VehicleState?.vehicleState ? this.searchModel.VehicleState.vehicleState : null,
      manufacturerName: this.selectedManufacturer?.manufacturerName ? this.selectedManufacturer.manufacturerName : null,
      modelName: this.selectedModel?.modelName ? this.selectedModel.modelName : null,
      seriesName: this.selectedSeries?.seriesName ? this.selectedSeries.seriesName : null,
      kilometri: this.handleSlider(this.searchModel.kilometri, 'kilometri'),
      godina: this.handleSlider(this.searchModel.godina, 'godina'),
      potrosnja: this.handleSlider(this.searchModel.potrosnja, 'potrosnja'),
      cijena: this.handleSlider(this.searchModel.cijena, 'cijena'),
    };
    if(this.dialog) {
      this.displayDlg = false;
    }
  }
  checkPropSlider(min,max,...value) {
    if(value[0] == min && value[1] == max) {
      return null;
    }
    return `${value[0]},${value[1]}`;
  }
  decrementValue(key, step, min, index) {
    if(this.searchModel[key][index] - step >= min) {
      this.searchModel[key][index] = this.searchModel[key][index] - step;
    }
  }
  incrementValue(key, step, max, index) {
    if(this.searchModel[key][index] + step <= max) {
      this.searchModel[key][index] = this.searchModel[key][index] + step;
    }
  }

  handleSlider(prop,key) {
    
    switch (key) {
      case 'kilometri':{
        return this.checkPropSlider(0, 3000000, prop[0], prop[1]);
      }
      case 'godina':{
        return this.checkPropSlider(1880, this.maxYear, prop[0], prop[1]);
      }
      case 'potrosnja':{
        return this.checkPropSlider(0, 50, prop[0], prop[1]);
      }
      case 'cijena':{
        return this.checkPropSlider(0, 50000, prop[0], prop[1]);
      }
      default:
        break;
    }
  }

  initSearchModel() {
    return {
      Colors: null,
      Body: null,
      DriveTrain: null,
      Transmission: null,
      VehicleState: null,
      GasType: null,
      Manufacturer: null,
      Series: null,
      Model:null,
      kilometri: [0,3000000],
      godina: [1880, this.maxYear],
      potrosnja: [0,50],
      cijena: [0, 50000]
    }
  }

  getSeriesData(event:any) {
    let manufacturer = event.value as Manufacturer;
    
    if(manufacturer == null) {
      this.selectedManufacturer = null;
      this.selectedSeries = null;
      this.selectedModel = null;
      this.series = null;
      this.models = null;

    }
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
    this.loader.startBackgroundLoader('advancedSearch');
    this.vehicleService.seriesFindByPkmanufacturer(this.selectedManufacturer.PkManufacturer).subscribe((res:any) => {
      this.loader.stopBackgroundLoader('advancedSearch');
      this.series = res.series;
    },err => {
      this.loader.stopBackgroundLoader('advancedSearch');
    });
  }
  getModelData(event) {
    let series = event.value as Series;
    if(series == null) {
      this.selectedSeries = null;
      this.selectedModel = null;
      this.models = null;

    }
    if(this.selectedSeries) {
      this.selectedSeries = null;
      this.models = null;
      this.selectedModel = null;
    }
    this.selectedSeries = series;
    if(this.selectedSeries == null) {
      return;
    }
    this.loader.startBackgroundLoader('advancedSearch');
    this.vehicleService.modelFindByPkSeries(this.selectedSeries.PkSeries).subscribe((res:any) => {
      this.models = res.models;
      this.loader.stopBackgroundLoader('advancedSearch');
    },err => {
      this.loader.stopBackgroundLoader('advancedSearch');
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
}
