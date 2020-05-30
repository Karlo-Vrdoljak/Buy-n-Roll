import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Manufacturer, Series, Model } from '../_types/manufacturer.interface';
import { VehicleService } from '../_services/vehicle.service';
import { fadeInUpOnEnterAnimation, fadeOutDownOnLeaveAnimation, fadeInRightOnEnterAnimation, fadeOutLeftOnLeaveAnimation } from 'angular-animations';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HelperService } from '../_services/helper.service';
import { searchTypes } from '../_types/misc';
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
  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public vehicleService: VehicleService,
    public loader:NgxUiLoaderService,
    public helperService: HelperService
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
    this.vehicleService.manufacturersFindAll().subscribe((manufs:Manufacturer[]) => {
      this.manufacturers = manufs.map(m => {
        m.manufacturerName = m.manufacturerName.toLocaleLowerCase();
        m.manufacturerName = m.manufacturerName.charAt(0).toUpperCase() + m.manufacturerName.slice(1); 
        return m;
      });
    });
    // this.infLog();
  }
  getSeriesData(event:any) {
    let manufacturer = event.value as Manufacturer;
    console.log("topbar", manufacturer);
    
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
  search(searchType: number) {
    if(searchType == searchTypes.text) {
      let sanitizedQuery = this.helperService.sanitizeQuery(this.searchQuery);
      if(sanitizedQuery.length > 1) {
        this.router.navigate(["catalogues", sanitizedQuery], {queryParams: {searchType: searchType}});
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
      console.log(this.series);
      this.infLog();
    }, 3000);
}

}
