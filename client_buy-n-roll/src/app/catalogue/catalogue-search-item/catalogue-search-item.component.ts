import { Component, OnInit, Input, NgZone, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { HelperService } from 'src/app/_services/helper.service';
import { Oglas, Photo } from 'src/app/_types/oglas.interface';
import { NgsRevealService } from 'ngx-scrollreveal';
import { Subscription } from 'rxjs';
import { Config } from 'src/environments/config';
import { CatalogueActionIconsComponent } from '../catalogue-action-icons/catalogue-action-icons.component';
import { OglasService } from 'src/app/_services/oglas.service';
import { Router } from '@angular/router';

interface DisplayType {
  large:"large";
  small:"small";
}
@Component({
  selector: 'app-catalogue-search-item',
  templateUrl: './catalogue-search-item.component.html',
  styleUrls: ['./catalogue-search-item.component.scss']
})
export class CatalogueSearchItemComponent implements OnInit, OnDestroy {

  @Input('item') searchItem:any;
  @Input('delay') delayCoef:number;
  delay:number[];
  price:number;
  countUpOptions:any;
  @Input('size') size: DisplayType;
  @Input('personal') personalOglas:boolean = false;
  @Input('username') oglasUsername: string;
  hideContact: boolean = false;
  showEdit: boolean = false;
  ignoreRating:boolean = false;

  loginSub:Subscription;
  @ViewChild('actionIcons') actionIcons :CatalogueActionIconsComponent;
  constructor(
    public helperService:HelperService,
    public revealService:NgsRevealService,
    public config:Config,
    private oglasService: OglasService,
    public router:Router
  ) { }
  ngOnDestroy(): void {
    this.revealService.destroy();
  }

  ngOnInit(): void {
    
    this.countUpOptions = {
      decimalPlaces: 2,
      suffix: ` ${this.searchItem.currencyName}`
    };
    this.price = Number(this.searchItem.priceMainCurrency + '.' +  this.searchItem.priceSubCurrency);
    
    this.delay = [80, 130, 210, 340, 550, 890];
    this.setupLoggedInUserObservable();

    this.handleOptionalPhotoOglas();
    
    if(this.personalOglas == false) {
      this.handleOptionalPhotoProfile();
    }
  }

  getPhotoUrlCssOglas() {
    return 'url(' + (this.searchItem.photos[0]?.PkPhoto != -1? this.config.STATIC_FILES + (this.searchItem.username ?? this.oglasUsername) + '/' + this.searchItem.photos[0].filename : this.searchItem.photos[0].path) + ')';
  }
  getPhotoUrlCssProfile() {
    return (this.searchItem.PkPhoto != -1? this.config.STATIC_FILES + (this.searchItem.username ?? this.oglasUsername) + '/' + this.searchItem.filename : this.searchItem.path);
  }

  handleOptionalPhotoOglas() {
    if(!this.searchItem.photos[0]?.filename) {
      this.searchItem.photos[0] = {
        PkPhoto: -1,
        path: "assets/images/catalogue/unknown.jpg"
      } as Photo;
    }
  }
  handleOptionalPhotoProfile() {
    if(!this.searchItem?.filename) {
      this.searchItem.PkPhoto = -1;
      this.searchItem.path = "assets/images/misc/noProfile.png"
    }
  }

  private setupLoggedInUserObservable() {
    this.loginSub = this.helperService.currentLogin.subscribe(event => {
      console.log('alo',this.config.user);
      
      if(this.config.user) {
        this.hideContact = this.config.user.username == (this.oglasUsername ?? this.searchItem.username)? true: false;
        this.showEdit = this.config.user.username == (this.oglasUsername ?? this.searchItem.username)? true: false;
      } else {
        this.hideContact = false;
        this.showEdit = false;
      }
      this.ignoreRating = false;
      this.actionIcons?.reloadState(this.hideContact, this.showEdit,this.ignoreRating);
    });
  }

  navigateProfile() {
    this.router.navigate([ '/profile', {username: this.searchItem.username} ]);
  }
  

  @HostListener("window:resize") updateOrientationState() { } // for ngCheckChanges cycle 
}
