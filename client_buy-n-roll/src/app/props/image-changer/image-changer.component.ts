import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-image-changer',
  templateUrl: './image-changer.component.html',
  styleUrls: ['./image-changer.component.scss']
})
export class ImageChangerComponent implements OnInit {

  @Input('single') single: boolean = true;
  @Input('multi') multi: boolean = false;
  @Input('opened') displayDlgSingleImg: boolean = false;
  @Output() onImageUpload = new EventEmitter<any>();

  @ViewChild("fp") FileUploader: FileUpload;

  payload:any = null;
  
  emitValue:any = null;
  showCancel:boolean = false;
  constructor() { }

  ngOnInit(): void {
    if(this.single == true) {
      this.multi = false;
    } else if(this.multi == true) {
      this.single = false;
    }
  }

  EmitValue() {
    console.log(this.emitValue);
    
    this.onImageUpload.emit(this.emitValue);
  }
  setEmitValue() {
    this.emitValue = this.payload;
    this.displayDlgSingleImg = false;
  }

  cancelUpload() {
    this.FileUploader.clear();
    this.payload = null;
    this.emitValue = null;
    let img = document.getElementById('uploaded_img') as HTMLElement;
    img.setAttribute('style', `background-image: url('assets/images/misc/noProfile.png')`);
    this.showCancel = false;
  }

  onUpload(event) {
    this.payload = event.files[0];
    let img = document.getElementById('uploaded_img') as HTMLElement;
    img.setAttribute('style', `background-image: url('${URL.createObjectURL(this.payload)}')`);
    this.showCancel = true;
  }

}
