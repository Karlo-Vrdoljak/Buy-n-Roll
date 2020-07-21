import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { HelperService } from 'src/app/_services/helper.service';
import { DomSanitizer } from '@angular/platform-browser';

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

  payloadMulti:any[] = [];
  
  emitValue:any = null;
  showCancel:boolean = false;
  constructor(
    public helperService: HelperService,
    public domSan: DomSanitizer
    ) { }

  ngOnInit(): void {
    console.log(this);
    
  }
  EmitValue() {
    this.onImageUpload.emit(this.emitValue);
  }
  setEmitValue() {
    if(this.single == true) {
      this.emitValue = this.payload;
    }
    if(this.multi == true) {
      this.emitValue = this.FileUploader.files;
    }
    this.displayDlgSingleImg = false;
  }
  getWidth(numberic = false) {
    let width = screen.availWidth;
    switch (true) {
      case width > 1200: {
        return numberic == false? '50vw': 50;
      }
      case width > 900 && width <= 1200 : {
        return numberic == false? '75vw': 75;    
      }
      case width <= 900 : {
        return numberic == false? '100vw': 100;
      }
      default:
        return numberic == false? '50vw': 50;
    }
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
  logger(l) {
    console.log(l);
  }

  removeImg(file:File) {
    this.FileUploader.files = this.FileUploader.files.filter((pm:File) => pm.name != file.name);

  }
  calcFileSize(size:number) {
    return (size * (Math.pow(10,-6))).toFixed(2)
  }
  getImgUri(img) {
    
    return this.domSan.bypassSecurityTrustResourceUrl(URL.createObjectURL(img));
  }
  truncate(name) {
    return this.helperService.truncateString(name, Math.round(screen.availWidth/32));
  }

}
