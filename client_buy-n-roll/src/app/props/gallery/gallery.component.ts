import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { BaseClass } from 'src/app/_services/base.class';
import { HelperService } from 'src/app/_services/helper.service';
import { Config } from 'src/environments/config';
import { ImageChangerComponent } from '../image-changer/image-changer.component';
import { rejects } from 'assert';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent extends BaseClass implements OnInit {

  numSlides:number;
  @Input('config') swiperGalleryConfig: any;
  @Input('photos') photos:any[] = [];
  @Input('useUpload') useUpload:boolean = true;
  @Input('useDelete') useDelete:boolean = true;
  @Output() photosChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onImageUpload = new EventEmitter<any>();
  @Output() onImageDelete = new EventEmitter<number>();
  markDelete:number = null;
  offset:number = 0.5;
  @ViewChild('ic') imgUploader:ImageChangerComponent;
  @ViewChild('cd') confirm:ConfirmDialogComponent;
  imgUpload:boolean = false;
  displayConfirm:boolean = false;
  constructor(
    public config:Config,
    public helperService: HelperService,
    private translate:TranslateService

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

  handleImages(images) {
    this.imgUploader.displayDlgSingleImg = true;
    this.imgUpload = false;
    this.onImageUpload.emit(images);
    // this.photosChange.emit(images);
   }
  setForDeletion(pkPhoto) {
    this.markDelete = pkPhoto;
    this.confirm.open();
  }
  confirmationResolve(choice = false) {
    if(choice == true) {
      this.onImageDelete.emit(this.markDelete);
      this.markDelete = null;

    } else {
      this.markDelete = null;
    }
  }
}
