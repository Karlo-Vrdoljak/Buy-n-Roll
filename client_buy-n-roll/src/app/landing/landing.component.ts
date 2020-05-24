import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from "@angular/core";
import { fromEvent, Observable, Subscription } from "rxjs";
import { Slide } from "../_types/Slides";
import { HelperService } from "../_services/helper.service";
import { deepCopy } from "owl-deepcopy";
import { Manufacturer, Series, Model } from '../_types/manufacturer.interface';
import { ActivatedRoute } from '@angular/router';
import { VehicleService } from '../_services/vehicle.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ManufacturerPropComponent } from '../props/manufacturer-prop/manufacturer-prop.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"],
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

  height:number;
  width:number;

  constructor(
    public helperService: HelperService, 
    public route: ActivatedRoute, 
    public vehicleService:VehicleService,
    public formBuilder: FormBuilder,
    public loader: NgxUiLoaderService
    ) {}

  ngAfterViewInit(): void {
    // var docWidth = document.documentElement.offsetWidth;
    // console.log(docWidth);
    // [].forEach.call(
    //   document.querySelectorAll('*'),
    //   function(el) {
    //     if (el.offsetWidth > docWidth) {
    //       console.log(el);
    //     }
    //   }
    // );
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
    console.log(this.shuffledSlides);
    
    this.slides = deepCopy(this.shuffledSlides);
    this.evalScreenSize();

    this.manufacturers = this.route.snapshot.data.pageData[0] || [];

    this.formGroupManufacturer = this.formBuilder.group({
      manufacturer: ['', Validators.required]
    });

    this.formGroupSeries = this.formBuilder.group({
      series: ['', Validators.required]
    });

    this.formGroupModel = this.formBuilder.group({
      model: ['', Validators.required]
    });

    console.log(this.manufacturers);

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
    console.log(this.selectedManufacturer);
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
    console.log(event);

    if(this.selectedSeries) {
      this.selectedSeries = null;
      this.models = null;
      this.selectedModel = null;
    }
    this.selectedSeries = event;
    console.log(this.selectedSeries);
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
    console.log(event);

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
