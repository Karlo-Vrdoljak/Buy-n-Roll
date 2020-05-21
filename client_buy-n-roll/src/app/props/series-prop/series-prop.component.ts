import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Series, Manufacturer } from 'src/app/_types/manufacturer.interface';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-series-prop',
  templateUrl: './series-prop.component.html',
  styleUrls: ['./series-prop.component.scss']
})
export class SeriesPropComponent implements OnInit {

  @Input() seriesList: Series[];
  selectedSeries: Series;
  @Input() height:number;

  @Output() passSelectedSeries = new EventEmitter<Series>();
  
  constructor() { }

  ngOnInit(): void {
  }


  emitSeries() {
    this.passSelectedSeries.emit(this.selectedSeries);
  }


}
