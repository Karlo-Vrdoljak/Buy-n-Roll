import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-location-prop',
  templateUrl: './location-prop.component.html',
  styleUrls: ['./location-prop.component.scss']
})
export class LocationPropComponent implements OnInit {

  @Input('visible') displayDlgLocations: boolean = false;
  locationList = [];
  @Output() onLocationSelect = new EventEmitter<any>();


  constructor() { }

  ngOnInit(): void {
  }
  passValue(location) {
    console.log(location);
    
    this.onLocationSelect.emit(location);
  }
  

}
