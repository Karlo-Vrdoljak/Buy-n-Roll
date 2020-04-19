import { Component, OnInit, OnDestroy } from "@angular/core";
import { fromEvent, Observable, Subscription } from "rxjs";
import { Slide } from "../_types/Slides";
import { HelperService } from "../_services/helper.service";
import { deepCopy } from "owl-deepcopy";
@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"],
})
export class LandingComponent implements OnInit, OnDestroy {
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

  constructor(public helperService: HelperService) {}

  ngOnInit(): void {
    
    this.orientationObservable$ = fromEvent(window, "orientationchange");
    this.orientationSubscription$ = this.orientationObservable$.subscribe((evt) => this.evalScreenSize());
    this.shuffledSlides = this.helperService.shuffle(this.defaultSlides());
    console.log(this.shuffledSlides);
    
    this.slides = deepCopy(this.shuffledSlides);
    this.evalScreenSize();

  }
  ngOnDestroy(): void {
    this.orientationSubscription$.unsubscribe();
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
      this.slides = deepCopy(this.shuffledSlides).map((e) => {
        e.src = e.src.split(".jpg")[0] + "m" + ".jpg";
        return e;
      });
    } else {
      this.slides = deepCopy(this.shuffledSlides);
    }
  }
}
