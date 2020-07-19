import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { BaseClass } from 'src/app/_services/base.class';
import { Config } from 'src/environments/config';
import { HelperService } from 'src/app/_services/helper.service';
import { BreadcrumbService } from 'src/app/_services/breadcrumb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgsRevealService } from 'ngx-scrollreveal';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserService } from 'src/app/_services/user.service';
import { ToastrService } from 'ngx-toastr';
import { TranslationList } from 'src/app/_services/translation.list';
import { Subscription } from 'rxjs';
import * as rfdc from 'rfdc';
import { SelectItem } from 'primeng/api';
import { PaymentMethod } from 'src/app/_types/oglas.interface';

@Component({
  selector: 'app-oglas-edit',
  templateUrl: './oglas-edit.component.html',
  styleUrls: ['./oglas-edit.component.scss']
})
export class OglasEditComponent extends BaseClass implements OnInit, OnDestroy {
  routerSub: Subscription;
  profileData: any;
  path: string;
  translations: any;
  oglas: any;
  returnUrl: string;
  breadcrumbs: any;
  translateSub: Subscription;
  oglasModel: any;
  currencyList:SelectItem[];
  iMaskMainCurrency = {
    mask: '000000000000000'

  }
  iMaskSubCurrency = {
    mask: '00'

  }
  pageIndex = 0;
  paymentMethodList:SelectItem[];
  textAreaMaxLength = this.config.textAreaMaxLength * 4;
  loginSub: Subscription;

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
    private translationProvider: TranslationList
  ) { 
    super(config,helperService);
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    this.translateSub?.unsubscribe();
    this.loginSub?.unsubscribe();
  }

  ngOnInit(): void {
    console.log(
      this.route.snapshot.data.pageData
    );
    
    this.profileData = this.route.snapshot.data.pageData[0] || [];
    this.path = this.route.snapshot.data.pageData[1] || '';
    this.translations = this.route.snapshot.data.pageData[2] || {}; 
    this.oglas = this.route.snapshot.data.pageData[3] || [];
    
    this.currencyList = this.initCurrencyList(this.route.snapshot.data.pageData[4] || []);
    this.setupOglasModel();
    this.setupLoginTracker();
    
    this.initPaymentMethod();
    this.setupBreadCrumbs();
    this.setupLangObservable();
    this.updateOrientationState();

  }

  setupLoginTracker() {
    this.loginSub = this.helperService.currentLogin.subscribe(event => {
      if(!this.config.user) {
        this.router.navigateByUrl(this.returnUrl);
      }
    });
  }
  setupOglasModel() {
    this.oglasModel = rfdc({proto:true})(this.oglas);
    this.oglasModel['selectedCurrency'] = this.currencyList.find(el =>  el.value.name.toLowerCase().includes(this.oglas.currencyName.toLowerCase()));
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
  initPaymentMethod() {
    this.paymentMethodList = Object.values(PaymentMethod).map(pm => {
      return {
        label: this.translations[pm],
        value: pm
      } as SelectItem;
    });

  }
  applyPaymentMethod(event) {
    this.oglasModel.selectedPaymentMethod = event;

  }
  logger(i) { console.log(i);}
  
  setupBreadCrumbs() {
    let prevRoute = this.route.snapshot.data.pageData[1] || '/';
    this.path = this.router.config.map(c => c.path).find(c => prevRoute.includes(c.split('/')[0]))?.split('/')[0];
    
    this.returnUrl = prevRoute;
    if(prevRoute != '/' && this.path) {
      this.breadcrumbs = this.breadcrumbService.basicMenu('EMPTY_STRING',this.breadcrumbService.determinePath());
    } else {
      this.breadcrumbs = this.breadcrumbService.basicMenu('EMPTY_STRING', null, this.oglas.oglasNaziv);
    }
  }

  setupLangObservable() {
    this.translateSub = this.translate.onLangChange.subscribe(event => {
      this.setupBreadCrumbs();
      this.translate.get(this.translationProvider.getRegistration()).subscribe(data => {
        this.translations = data;
        this.initPaymentMethod();
        this.applyPaymentMethod(this.paymentMethodList.find(pm => pm.value == this.oglasModel.selectedPaymentMethod.value));

      });
    });
  }

}
