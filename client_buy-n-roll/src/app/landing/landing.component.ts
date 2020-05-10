import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { fromEvent, Observable, Subscription } from "rxjs";
import { Slide } from "../_types/Slides";
import { HelperService } from "../_services/helper.service";
import { deepCopy } from "owl-deepcopy";
import { IParallaxScrollConfig } from 'ngx-parallax-scroll';
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
  // ngParallaxConf: IParallaxScrollConfig = {
  //   parallaxSpeed: 1,
  //   parallaxSmoothness: 1,
  //   parallaxDirection: 'reverse',
  //   parallaxTimingFunction: 'ease-in',
  //   parallaxThrottleTime: 20
  // };
  slides: Slide[];
  shuffledSlides: Slide[];
  index: number = 0;

  orientationObservable$: Observable<Event>;
  orientationSubscription$: Subscription;

  scrollObservable$: Observable<Event>;
  scrollSubscription$: Subscription;


  constructor(public helperService: HelperService) {}
  ngAfterViewInit(): void {
    var docWidth = document.documentElement.offsetWidth;
    console.log(docWidth);
    [].forEach.call(
      document.querySelectorAll('*'),
      function(el) {
        if (el.offsetWidth > docWidth) {
          console.log(el);
        }
      }
    );
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

    if (screen.availWidth < 500) {
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
}
