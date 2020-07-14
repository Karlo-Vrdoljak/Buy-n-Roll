import { Component, OnInit, Input, NgZone, HostListener, OnDestroy } from '@angular/core';
import { HelperService } from 'src/app/_services/helper.service';
import { Oglas } from 'src/app/_types/oglas.interface';
import { NgsRevealService } from 'ngx-scrollreveal';

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
  constructor(
    public helperService:HelperService,
    public revealService:NgsRevealService
  ) { }
  ngOnDestroy(): void {
    this.revealService.destroy();
  }

  ngOnInit(): void {
    console.log(this.searchItem);
    
    this.countUpOptions = {
      decimalPlaces: 2,
      suffix: ` ${this.searchItem.currencyName}`
    };
    this.price = Number(this.searchItem.priceMainCurrency + '.' +  this.searchItem.priceSubCurrency);
    
    this.delay = [80, 130, 210, 340, 550, 890];
    
  }

  @HostListener("window:resize") updateOrientationState() { } // for ngCheckChanges cycle 
}
