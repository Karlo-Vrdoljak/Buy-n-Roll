import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Manufacturer, Series, Model } from '../_types/manufacturer.interface';
import { VehicleService } from '../_services/vehicle.service';
import { fadeInUpOnEnterAnimation, fadeOutDownOnLeaveAnimation, fadeInRightOnEnterAnimation, fadeOutLeftOnLeaveAnimation } from 'angular-animations';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HelperService } from '../_services/helper.service';
import { searchTypes } from '../_types/misc';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TranslationList } from '../_services/translation.list';
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
export class TopbarComponent implements OnInit {
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
  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public vehicleService: VehicleService,
    public loader:NgxUiLoaderService,
    public helperService: HelperService,
    public toast:ToastrService,
    public translate: TranslateService,
    public translateProvider: TranslationList
  ) { }
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
      });
    forkJoin(
      this.vehicleService.manufacturersFindAll(),
      this.translate.get(this.translateProvider.getLanding())
    ).subscribe(([manufs, t]:[Manufacturer[], any]) => {
      this.translations = t || {};
      this.manufacturers = manufs.map(m => {
        m.manufacturerName = m.manufacturerName.toLocaleLowerCase();
        m.manufacturerName = m.manufacturerName.charAt(0).toUpperCase() + m.manufacturerName.slice(1); 
        return m;
      });
    });
    this.searchQuery = '';
    // this.infLog();
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
        this.router.navigate(["catalogues",params], {queryParams: {searchType:searchType}});
        this.displaySidebar = false;
      }
    }
  }
  infLog() {
    setTimeout(() => {
      this.infLog();
    }, 3000);
}

}
