import { Component, OnInit, Input, NgZone, HostListener } from '@angular/core';
import { HelperService } from 'src/app/_services/helper.service';

@Component({
  selector: 'app-catalogue-search-item',
  templateUrl: './catalogue-search-item.component.html',
  styleUrls: ['./catalogue-search-item.component.scss']
})
export class CatalogueSearchItemComponent implements OnInit {

  @Input('item') searchItem:any;
  @Input('delay') delayCoef:number;
  delay:number[];
  constructor(
    public helperService:HelperService,
  ) { }

  ngOnInit(): void {
    
    this.delay = [80, 130, 210, 340];
    
  }

  @HostListener("window:resize") updateOrientationState() { } // for ngCheckChanges cycle 
}
