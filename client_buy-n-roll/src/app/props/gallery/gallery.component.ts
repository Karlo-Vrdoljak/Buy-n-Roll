import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BaseClass } from 'src/app/_services/base.class';
import { HelperService } from 'src/app/_services/helper.service';
import { Config } from 'src/environments/config';
import { ImageChangerComponent } from '../image-changer/image-changer.component';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent extends BaseClass implements OnInit {

  numSlides:number;
  @Input('config') swiperGalleryConfig: any;
  @Input('photos') photos:any;
  offset:number = 0.5;
  @ViewChild('ic') imgUploader:ImageChangerComponent;
  imgUpload:boolean = false;
  constructor(
    public config:Config,
    public helperService: HelperService,

  ) {
    super(config, helperService);
  }

  ngOnInit(): void {
    this.updateOrientationState();
   }

  openImageUpload() {
    this.imgUpload = this.imgUpload == false? true: false;
  }

  updateOrientationState() {
    
    let width = this.helperService.getScreenX();
    if(this.helperService.isPortrait()) {
      switch (true) {
        case width > 1200: {
          this.swiperGalleryConfig.slidesPerView = 5;
          this.swiperGalleryConfig.slidesPerGroup = 5;
          break;
        }
        case width > 700 && width <= 1200 : {
          this.swiperGalleryConfig.slidesPerView = 3;
          this.swiperGalleryConfig.slidesPerGroup = 3;
          break;
        }
        case width <= 700 : {
          this.swiperGalleryConfig.slidesPerView = 1;
          this.swiperGalleryConfig.slidesPerGroup = 1;
          break;
        }
        default:
          break;
      }
    } else {
      switch (true) {
        case width > 1200: {
          this.swiperGalleryConfig.slidesPerView = 5;  
          this.swiperGalleryConfig.slidesPerGroup = 5;  
          break;
        }
        case width > 600 && width <= 1200 : {
          this.swiperGalleryConfig.slidesPerView = 4;  
          this.swiperGalleryConfig.slidesPerGroup = 4;  
          break;
        }
        case width <= 600 : {
          this.swiperGalleryConfig.slidesPerView = 3;  
          this.swiperGalleryConfig.slidesPerGroup = 3;  
          break;
        }
        default:
          break;
      }
    }
    this.swiperGalleryConfig = this.initSwiper();
    
  }
  initSwiper(): any {
    return {... this.swiperGalleryConfig};
  }

  handleImages(event) {
    this.imgUploader.displayDlgSingleImg = true;
    this.imgUpload = false;
    console.log(event);
    
   }

}
