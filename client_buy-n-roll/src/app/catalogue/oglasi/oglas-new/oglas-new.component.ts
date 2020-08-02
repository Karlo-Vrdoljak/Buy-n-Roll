import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/_services/helper.service';
import { BreadcrumbService } from 'src/app/_services/breadcrumb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgsRevealService } from 'ngx-scrollreveal';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserService } from 'src/app/_services/user.service';
import { ToastrService } from 'ngx-toastr';
import { TranslationList } from 'src/app/_services/translation.list';
import { VehicleService } from 'src/app/_services/vehicle.service';
import { OglasService } from 'src/app/_services/oglas.service';
import { Config } from 'src/environments/config';
import { SelectItem } from 'primeng/api';
import { Color, Drivetrain, Transmission, Manufacturer } from 'src/app/_types/manufacturer.interface';
import { BaseClass } from 'src/app/_services/base.class';

@Component({
  selector: 'app-oglas-new',
  templateUrl: './oglas-new.component.html',
  styleUrls: ['./oglas-new.component.scss']
})
export class OglasNewComponent extends BaseClass implements OnInit {
  profileData: any;
  path: any;
  translations: any;
  oglas: any;
  currencyList: SelectItem[];
  colorList: Color[];
  bodyList: Body[];
  drivetrainList: Drivetrain[];
  transmissionList: Transmission[];
  manufList: Manufacturer[];
  showBanner:boolean = true;
  constructor(
    public config:Config,
    public helperService: HelperService,
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute,
    private router: Router,
    private translate:TranslateService,
    public revealService:NgsRevealService,
    private loader: NgxUiLoaderService,
    private userService:UserService,
    private toast:ToastrService,
    private translationProvider: TranslationList,
    private vehicleService: VehicleService,
    private oglasService: OglasService
  ) { super(config,helperService); }

  ngOnInit(): void {

    this.profileData = this.route.snapshot.data.pageData[0] || [];
    this.path = this.route.snapshot.data.pageData[1] || '';
    this.translations = this.route.snapshot.data.pageData[2] || {}; 
    this.oglas = null;
    this.currencyList = this.initCurrencyList(this.route.snapshot.data.pageData[3] || []);
    this.colorList = this.route.snapshot.data.pageData[4] || [];
    this.bodyList = this.route.snapshot.data.pageData[5] || [];
    this.drivetrainList = this.route.snapshot.data.pageData[6] || [];
    this.transmissionList = this.route.snapshot.data.pageData[7] || [];
    this.manufList = this.route.snapshot.data.pageData[8] || [];
  }

  initCurrencyList(list:any[]) {
    return Object.values(list).map(item => {
      return {
        label: item.symbol + ' ' + item.name,
        value: {
          name: item.name,
          symbol: item.symbol
        }
      } as SelectItem;
    });
  }
  handleCreatedOglas(result:boolean) {
    if(result == true) {
      this.showBanner = false;
    }
  }


}
