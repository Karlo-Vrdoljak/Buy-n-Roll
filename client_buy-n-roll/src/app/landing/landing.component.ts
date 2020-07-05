import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from "@angular/core";
import { fromEvent, Observable, Subscription } from "rxjs";
import { Slide } from "../_types/Slides";
import { HelperService } from "../_services/helper.service";
import { deepCopy } from "owl-deepcopy";
import { Manufacturer, Series, Model } from '../_types/manufacturer.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../_services/vehicle.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ManufacturerPropComponent } from '../props/manufacturer-prop/manufacturer-prop.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { fadeInRightOnEnterAnimation, fadeOutLeftOnLeaveAnimation } from 'angular-animations';
import { searchTypes } from '../_types/misc';
import { ToastrService } from 'ngx-toastr';
import { NgsRevealService } from 'ngx-scrollreveal';

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"],
  animations: [
    fadeInRightOnEnterAnimation(),
    fadeOutLeftOnLeaveAnimation()
  ]
})
export class LandingComponent implements OnInit, OnDestroy, AfterViewInit {
  config = {
    direction: "horizontal",
    slidesPerView: 1,
    keyboard: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    allowTouchMove: true,
    effect: "fade",
    speed: 1000,
  };

  slides: Slide[];
  shuffledSlides: Slide[];
  index: number = 0;

  orientationObservable$: Observable<Event>;
  orientationSubscription$: Subscription;

  scrollObservable$: Observable<Event>;
  scrollSubscription$: Subscription;

  formGroupManufacturer:FormGroup;
  formGroupSeries:FormGroup;
  formGroupModel:FormGroup;

  manufacturers:Manufacturer[];
  selectedManufacturer: Manufacturer;
  @ViewChild('manufacturerProp', { static: false })
  manufacturerProp: ManufacturerPropComponent;

  series: Series[];
  selectedSeries: Series;

  models:Model[];
  selectedModel: Model;

  searchQuery:string;

  height:number;
  width:number;
  translations:any;

  constructor(
    public helperService: HelperService, 
    public route: ActivatedRoute, 
    public vehicleService:VehicleService,
    public formBuilder: FormBuilder,
    public loader: NgxUiLoaderService,
    public router:Router,
    public toast: ToastrService,
    public revealService: NgsRevealService
    ) {}

  ngAfterViewInit(): void {
    // var docWidth = document.documentElement.offsetWidth;
    // [].forEach.call(
    //   document.querySelectorAll('*'),
    //   function(el) {
    //     if (el.offsetWidth > docWidth) {
    //     }
    //   }
    // );
  }

  search(searchType: number) {
    if(searchType == searchTypes.text) {
      let sanitizedQuery = this.helperService.sanitizeQuery(this.searchQuery);
      if(sanitizedQuery.length > 1) {
        this.router.navigate(["catalogues", sanitizedQuery], {queryParams: {searchType: searchType}});
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
      }
    }
  }

  ngOnInit(): void {
    this.orientationObservable$ = fromEvent(window, "orientationchange");
    this.scrollObservable$ = fromEvent(window, "scroll");
    this.scrollSubscription$ = this.scrollObservable$.subscribe((evt) => {
      let topbar = document.getElementById('topbar') as HTMLElement;
      if(window.scrollY > (screen.availHeight*0.25)) {
        if(!topbar.classList.contains('transparent')) {
          topbar.classList.add('transparent');
        }
      } else {
        if(topbar.classList.contains('transparent')) {
          topbar.classList.remove('transparent');
        }
      }
      
    });
    this.orientationSubscription$ = this.orientationObservable$.subscribe((evt) => this.evalScreenSize());
    this.shuffledSlides = this.helperService.shuffle(this.defaultSlides());
    
    this.slides = deepCopy(this.shuffledSlides);
    this.evalScreenSize();

    this.manufacturers = this.route.snapshot.data.pageData[0] || [];

    this.translations = this.route.snapshot.data.pageData[1] || {};

    this.formGroupManufacturer = this.formBuilder.group({
      manufacturer: ['', Validators.required]
    });

    this.formGroupSeries = this.formBuilder.group({
      series: ['', Validators.required]
    });

    this.formGroupModel = this.formBuilder.group({
      model: ['', Validators.required]
    });

    this.searchQuery = '';
  }

  acceptSelectedManufacturer(event:Manufacturer) {
    if(this.selectedManufacturer) {
      this.selectedManufacturer = null;
      this.series = null;
      this.selectedSeries = null;
      this.selectedModel = null;
      this.models = null;
    }
    this.selectedManufacturer = event;
    if(this.selectedManufacturer == null) {
      return;
    }
    this.loader.startBackgroundLoader('vehicle');
    this.vehicleService.seriesFindByPkmanufacturer(this.selectedManufacturer.PkManufacturer).subscribe((res:any) => {
      this.series = res.series;
      this.loader.stopBackgroundLoader('vehicle');
    }, err => this.loader.stopBackgroundLoader('vehicle'));
    
  }
  acceptSelectedSeries(event:Series) {

    if(this.selectedSeries) {
      this.selectedSeries = null;
      this.models = null;
      this.selectedModel = null;
    }
    this.selectedSeries = event;
    if(this.selectedSeries == null) {
      return;
    }
    this.loader.startBackgroundLoader('vehicle');
    this.vehicleService.modelFindByPkSeries(this.selectedSeries.PkSeries).subscribe((res:any) => {
      this.models = res.models;
      this.loader.stopBackgroundLoader('vehicle');
    },err => this.loader.stopBackgroundLoader('vehicle'));

  }

  acceptSelectedModel(event:Model) {

    if(this.selectedModel == event) {
      return;
    } else if (event == null) {
      this.selectedModel = null;
      // this.series = null;
      return;
    }
    this.selectedModel = event;

  }

  scrollToEl(id: string) {
    document.getElementById(id).scrollIntoView({ block: "start", behavior: 'smooth' });
  }
  ngOnDestroy(): void {
    this.orientationSubscription$.unsubscribe();
    this.scrollSubscription$.unsubscribe();
    this.revealService.destroy();
  }

  defaultSlides() {
    return [
      {
        src: "assets/images/landing/car_1.jpg",
      },
      {
        src: "assets/images/landing/car_2.jpg",
      },
      {
        src: "assets/images/landing/car_3.jpg",
      },
      {
        src: "assets/images/landing/car_4.jpg",
      },
    ];
  }
  evalScreenSize() {
    this.calcScreenHeightForProps();
    this.width = screen.availWidth;
    if (this.width < 500) {
      this.slides = [];
      this.slides = deepCopy(this.shuffledSlides).map((e) => {
        e.src = e.src.split(".jpg")[0] + "m" + ".jpg";
        return e;
      });
    } else {
      this.slides = [];
      this.slides = deepCopy(this.shuffledSlides);
    }
  }
  calcScreenHeightForProps() {
    if(this.helperService.isPortrait()){
      switch (true) {
        case screen.availHeight < 600: {
          this.height = (screen.availHeight/8);
          break;
        }
        case screen.availHeight < 700: {
          this.height = (screen.availHeight/6);
          break;
        }
        case screen.availHeight >= 700 && screen.availHeight < 850: {
          this.height = (screen.availHeight/4);
          break;
        }
        case screen.availHeight >= 850 && screen.availHeight < 1500: {
          this.height = (screen.availHeight/4);
          break;
        }
        default:
          this.height = (screen.availHeight/4);
          break;
      }
    } else {
      switch (true) {
        case screen.availHeight < 600: {
          this.height = (screen.availHeight/8);
          break;
        }
        case screen.availHeight < 700: {
          this.height = (screen.availHeight/6);
          break;
        }
        case screen.availHeight >= 700 && screen.availHeight < 850: {
          this.height = (screen.availHeight/5);
          break;
        }
        case screen.availHeight >= 850 && screen.availHeight < 1500: {
          this.height = (screen.availHeight/4);
          break;
        }
        default:
          this.height = (screen.availHeight/4);
          break;
      }
    }
  }
}
