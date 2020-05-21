import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Model } from 'src/app/_types/manufacturer.interface';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-model-prop',
  templateUrl: './model-prop.component.html',
  styleUrls: ['./model-prop.component.scss']
})
export class ModelPropComponent implements OnInit {

  @Input() modelList: Model[];
  selectedModel: Model;
  @Input() height:number;

  @Output() passSelectedModel = new EventEmitter<Model>();
  
  constructor() { }

  ngOnInit(): void {
  }


  emitModel() {
    this.passSelectedModel.emit(this.selectedModel);
  }


}
