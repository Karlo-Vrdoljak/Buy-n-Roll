import { Component, OnInit, Input } from "@angular/core";
import { Config } from "src/environments/config";
import {
  fadeInRightOnEnterAnimation,
  fadeOutLeftOnLeaveAnimation,
} from "angular-animations";
import { UserService } from 'src/app/_services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { OglasService } from 'src/app/_services/oglas.service';

@Component({
  selector: "app-kupoprodajni",
  templateUrl: "./kupoprodajni.component.html",
  styleUrls: ["./kupoprodajni.component.scss"],
  animations: [fadeInRightOnEnterAnimation(), fadeOutLeftOnLeaveAnimation()],
})
export class KupoprodajniComponent implements OnInit {
  @Input("oglas") oglas: any;
  buyersList:any[] = [];
  buyerCols: { field: string; header: string; }[];
  propertyCols: { field: string; header: string; }[];
  propertyList: { field: string; label: string; }[];
  state: { loadKupac: boolean; loadProdavac: boolean; useAllData: boolean; steps: { one: boolean; two: boolean; three: boolean; }; user: any; selectedProps: any; };
  constructor(
    public config: Config, 
    public userService: UserService,
    public loader:NgxUiLoaderService,
    public oglasService: OglasService
  ) {}

  ngOnInit(): void {
    this.buyerCols = this.initBuyerCols();
    this.state = this.defaultState();
    this.state.steps.one = true;
  }

  defaultState() {
    return {
      loadKupac: false,
      loadProdavac: true,
      useAllData: true,
      steps: {
        one: false,
        two: false,
        three: false
      },
      user: null,
      selectedProps: null
    };
  }
  initBuyerCols() {
    return [
      { field: 'username', header: 'BUYER' },
    ];
  }
  initPropertyCols() {
    return [
      { field: 'prop', header: 'POJAM' },
    ]
  }
  initPropertyData() {
    return [
      { field: 'firstName,lastName', label: 'FNAME_LNAME'},
      { field: 'display_name', label: 'LOCATIONUSER'},
      { field: 'manufacturerName', label: 'MANUFACTURER'},
      { field: 'color', label: 'COLOR'},
      { field: 'modelName', label: 'MODEL'},
      { field: 'seriesName', label: 'SERIJA'},
      { field: 'VIN', label: 'VIN'},
      { field: 'bodyName', label: 'BODY'},
      { field: 'makeYear', label: 'GODINA_PROIZVODNJE'},
    ]
  }

  finishStep(index: number) {
    switch (index) {
      case 1: {
        this.resolveStepOne();
        break;
      }
      case 2: {
        this.resolveStepTwo();
        break;
      }
      case 3: {
        this.finalize();
        break;
      }
      default:
        break;
    }
  }
  
  resolveStepOne() {
    for (var key in this.state.steps) {
      this.state.steps[key] = false;
    }
    if(this.state.loadKupac == false && this.state.useAllData == true) {
      this.finalize();
      return;
    } 
    if(this.state.loadKupac == false && this.state.useAllData == false) {
      this.initiateStepThree();
      return;
    }
    this.loader.startLoader('step_one');
    this.userService.findAllUsers().subscribe((data:any[]) => {
      this.buyersList = data.filter(u => u.userId != this.config.user.sub);
      this.state.steps.two = true;

      this.loader.stopLoader('step_one');
    }, err=> {
      this.loader.stopLoader('step_one');
    });


  }
  resolveStepTwo() {
    for (var key in this.state.steps) {
      this.state.steps[key] = false;
    }
    if(this.state.useAllData == false) {
      this.initiateStepThree();
    } else {
      this.finalize();
    }

  }
  initiateStepThree() {
    this.propertyCols = this.initPropertyCols();
    this.propertyList = this.initPropertyData();
    this.state.steps.three = true;
  }
  finalize() {

    let params = {
      loadKupac: this.state.loadKupac,
      loadProdavac: this.state.loadProdavac,
      useAllData: this.state.useAllData,
      selectedProps: this.state.selectedProps?.map(p => p.field),
      kupacId: this.state.loadKupac? this.state.user.userId : null,
      PkOglas: this.oglas.PkOglas,
      prodavacId: this.state.loadProdavac? this.oglas.vehicle.user.userId: null
    }

    this.loader.startLoader('step_three');

    this.oglasService.generatePdf(params).subscribe((data:any) => {
      let reportPdf = new Blob([data], {
        type: 'application/pdf'
      });
      let objectURL = URL.createObjectURL(reportPdf);
      
      Object.assign(document.createElement('a'), { target: '_blank', href: objectURL}).click();
      
      this.state = this.defaultState();
      this.buyersList = [];
      this.loader.stopLoader('step_three');
    }, err => {
      this.state = this.defaultState();
      this.buyersList = [];

      this.loader.stopLoader('step_three');
    });
    
  }


  openDialogContract() {
    this.state.steps.one = true;
  }
  EmitValue() {
    this.state.steps.one = false;
  }
}
