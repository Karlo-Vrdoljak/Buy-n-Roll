import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Manufacturer } from 'src/app/_types/manufacturer.interface';
import { HttpClient } from '@angular/common/http';
import { FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-manufacturer-prop',
  templateUrl: './manufacturer-prop.component.html',
  styleUrls: ['./manufacturer-prop.component.scss'],
})
export class ManufacturerPropComponent implements OnInit {

  @Input() manufacturerList: Manufacturer[];
  selectedManufacturer: Manufacturer;
  @Input() height:number;

  @Output() passSelectedManufacturer = new EventEmitter<Manufacturer>();


  constructor() { }

  ngOnInit() { 
    this.manufacturerList = this.manufacturerList.map(m => {
      m.manufacturerName = m.manufacturerName.toLocaleLowerCase();
      m.manufacturerName = m.manufacturerName.charAt(0).toUpperCase() + m.manufacturerName.slice(1); 
      return m;
    });
  }

  emitManufacturer() {
    this.passSelectedManufacturer.emit(this.selectedManufacturer);
  }

  setManufacturer(manufacturer:Manufacturer) {
    this.selectedManufacturer = manufacturer;
  }

}
