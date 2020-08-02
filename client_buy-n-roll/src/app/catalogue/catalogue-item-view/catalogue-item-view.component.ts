import { Component, OnInit, HostListener, AfterViewInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationEnd, ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'src/app/_services/breadcrumb.service';
import { HelperService } from 'src/app/_services/helper.service';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { NgsRevealService } from 'ngx-scrollreveal';
import { User } from 'src/app/_types/user.interface';
import { Photo, OglasStatus } from 'src/app/_types/oglas.interface';
import { UserService } from 'src/app/_services/user.service';
import { Config } from 'src/environments/config';
import { CatalogueActionIconsComponent } from '../catalogue-action-icons/catalogue-action-icons.component';
import { fadeInRightOnEnterAnimation, fadeOutLeftOnLeaveAnimation, fadeInUpOnEnterAnimation, fadeOutDownOnLeaveAnimation } from 'angular-animations';
import { ToastrService } from 'ngx-toastr';
import * as rfdc from 'rfdc';
import { OglasService } from 'src/app/_services/oglas.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ConfirmDialogComponent } from 'src/app/props/confirm-dialog/confirm-dialog.component';
import { KupoprodajniComponent } from 'src/app/props/kupoprodajni/kupoprodajni.component';
@Component({
  selector: 'app-catalogue-item-view',
  templateUrl: './catalogue-item-view.component.html',
  styleUrls: ['./catalogue-item-view.component.scss'],
  animations: [
    fadeInRightOnEnterAnimation(),
    fadeOutLeftOnLeaveAnimation(),
    fadeInUpOnEnterAnimation(),
    fadeOutDownOnLeaveAnimation(),

  ]
})
export class CatalogueItemViewComponent implements OnInit, AfterViewInit {
  breadcrumbs: MenuItem[];
  routerSubscription$: Subscription;
  translateSubscription$:Subscription;
  oglas:any;
  displayAccessories:boolean = true;
  returnUrl:string;
  countUpOptions:any;
  price:number;
  delay:number[];
  profileData:User;
  hideContact:boolean = false;
  showEdit: boolean = false;
  loginSub: Subscription;
  numSlides:number = 5;
  swiperGalleryConfig:any;

  komentar:string = '';
  rootKomentar:string = '';
  komentarNode = null;
  enablePdf:boolean = false;

  @ViewChild('cd') confirm: ConfirmDialogComponent;
  
  @ViewChild('kp') kupoprodajni: KupoprodajniComponent;
  @ViewChild('op') commentPanel: OverlayPanel;
  @ViewChild('actionIcons') actionIcons: CatalogueActionIconsComponent;
  @ViewChild('statusOverlay') statusOverlayPanel: OverlayPanel;
  
  markNodeDelete: any;
  statusList: OglasStatus[];
  statusIndex = null;
  initialStatus:OglasStatus = null;
  
  constructor(
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute,
    public router: Router,
    public helperService: HelperService,
    private translate:TranslateService,
    public revealService:NgsRevealService,
    private userService:UserService,
    private oglasService: OglasService,
    public config:Config,
    public toast: ToastrService,
    private loader:NgxUiLoaderService

  ) { }
  ngAfterViewInit(): void { }
  

  @HostListener("window:resize") updateOrientationState() {
    this.displayAccessories = this.helperService.getScreenY() < 450? false: true;
  }

  ngOnDestroy(): void {
    this.routerSubscription$.unsubscribe();
    this.translateSubscription$.unsubscribe();
    this.revealService.destroy();
    this.loginSub?.unsubscribe();
    
  }

  async ngOnInit() {
    this.oglas = this.route.snapshot.data.pageData[0] || null;
    await this.setupOglasUserData();
    
    this.setupLoggedInUserObservable();
    
    this.setupOglasData();

    this.setupBreadCrumbs();

    this.setupLangObservable();
    
    this.updateOrientationState();

    this.swiperGalleryConfig = this.initSwiper();

    this.oglas.photos = this.initOglasImages(this.oglas.photos);

    this.statusList = Object.values(OglasStatus);
    this.initialStatus = rfdc({proto:true})(this.oglas.status);

  }

  private initOglasImages(photos) {
    return photos.map(p => {
      return {
        ...p,
        src: this.config.STATIC_FILES + this.profileData.username + '/' + p.filename,
        thumb: this.config.STATIC_FILES + this.profileData.username + '/' + p.filename,
        title: p.originalname
      }
    });
  }

  private setupLoggedInUserObservable() {

    this.loginSub = this.helperService.currentLogin.subscribe(event => {
      if(this.config.user) {
        this.hideContact = this.config.user.username == this.profileData.username? true: false;
        this.showEdit = this.config.user.username == this.profileData.username? true: false;
      } else {
        this.hideContact = false;
        this.showEdit = false;
      }
      this.actionIcons?.reloadState(this.hideContact, this.showEdit);
    });

  }

  private async setupOglasUserData() {
    this.profileData = this.oglas.vehicle.user;
    this.userService.getUserPhoto(this.oglas.vehicle.user.username).subscribe(data => {
      this.profileData.photo = data?.photo;
      this.handleProfilePicture();
    });
  }
  getPhotoUrlCss() {
    return (this.profileData.photo.PkPhoto != -1? this.config.STATIC_FILES + this.profileData.username + '/' + this.profileData.photo.filename : this.profileData.photo.path);
  }

  private handleProfilePicture() {
    if(!this.profileData.photo?.filename) {
      this.profileData.photo = {
        PkPhoto: -1,
        path: "assets/images/misc/noProfile.png"
      } as Photo;
    }
  }
  private setupLangObservable() {
    this.translateSubscription$ = this.translate.onLangChange.subscribe(event => {
      this.breadcrumbs = this.breadcrumbService.catalogue();
    });
  }

  private setupBreadCrumbs() {
    let prevRoute = this.route.snapshot.data.pageData[1] || '/';
    let path = this.router.config.map(c => c.path).find(c => prevRoute.includes(c.split('/')[0])).split('/')[0];
    this.returnUrl = prevRoute;

    if(prevRoute != '/' && path) {
      this.breadcrumbs = this.breadcrumbService.catalogueItem(this.oglas.oglasNaziv, this.breadcrumbService.determinePath());
    } else {
      this.breadcrumbs = this.breadcrumbService.catalogueItem(this.oglas.oglasNaziv);
    }
    
    this.routerSubscription$ = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.oglas = null;
        this.oglas = this.route.snapshot.data.pageData[0] || null;
      }
    });
  }

  private setupOglasData() {
    this.countUpOptions = {
      decimalPlaces: 2,
      suffix: ` ${this.oglas.currencyName}`
    };
    this.price = Number(this.oglas.priceMainCurrency + '.' +  this.oglas.priceSubCurrency);
    
    this.delay = [80, 130, 210, 340, 550, 890];

    for (let index = 0; index < this.oglas.commentTree.length; index++) {
      this.oglas.commentTree[index].root = true;
      this.oglas.commentTree[index].hideChild = true;
    }

  }

  initSwiper() {
    return {
      spaceBetween: 30,
      slidesPerView: this.numSlides,
      slidesPerGroup: this.numSlides,
      direction: 'horizontal',
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      grabCursor: true,
      mousewheel: true,
      speed: 1500,
      effect: 'slide',
      observer: true,
      observeParents: true,
      updateOnWindowResize: true,
      initialSlide: 0
    };
  }

  toastNoLogin() {
    if(!this.config.user) {
      this.toast.info(this.translate.instant('LOGIN_BEFORE_COMMENT'));
    }
  }
  clearComment() {
    this.komentar = '';
    this.komentarNode = null;
  }

  setCommentTarget(node) {
    this.komentarNode = node;
    
  }
  postComment(rootComment = false) {
    let nodeId = null;
    let params = null;
    if(rootComment == false) {
      if(!this.komentar.length) {
        return;
      }
      nodeId = this.komentarNode.id;
      params = {
        komentar: this.komentar,
        nodeId: this.komentarNode.id,
        pkOglas: this.oglas.PkOglas,
        userId: this.config.user.sub,
      }
    } else {
      if(!this.rootKomentar.length) {
        return;
      }
      params = {
        komentar: this.rootKomentar,
        nodeId: null,
        pkOglas: this.oglas.PkOglas,
        userId: this.config.user.sub,
      }
    }

    this.commentPanel.hide();

    this.loader.startLoader('comment_loader');
    this.oglasService.postComment(params).subscribe((tree:any) => {

      this.setupCommentTree(tree,nodeId);
      this.rootKomentar = '';
      this.komentar = '';
      this.loader.stopLoader('comment_loader');
      
    }, err => {
      this.loader.stopLoader('comment_loader');
    });
  }

  setupCommentTree(tree, nodeId = null) {
    this.oglas.commentTree = tree;
    for (let index = 0; index < this.oglas.commentTree.length; index++) {
      this.oglas.commentTree[index].root = true;
      this.oglas.commentTree[index].hideChild = true;
    }
    if(nodeId) {
      this.oglas.commentTree[this.traverse(this.oglas.commentTree, nodeId)].hideChild = false;
    }
  }

  confirmationResolve(choice = false) {
    if(choice == true) {
      let params = {
        pkOglas: this.oglas.PkOglas,
        nodeId: this.markNodeDelete.id,

      }
      this.loader.startLoader('comment_loader');

      this.oglasService.softDeleteComment(params).subscribe((tree:any) => {
        this.setupCommentTree(tree,params.nodeId);
        this.markNodeDelete = null;
        this.loader.stopLoader('comment_loader');
      });
      this.loader.stopLoader('comment_loader');
      this.markNodeDelete = null;
      
    } else {
      this.markNodeDelete = null;
    }
  }

  deleteNode(node) {
    this.markNodeDelete = node;
    this.confirm.open();

  }

  traverse(tree:any[],targetNodeId) {
    return tree.findIndex(item => this.traverseChildren(item, targetNodeId));
  }

  traverseChildren(current: any, targetNodeId: number) {
    return current.id === targetNodeId? true : current.children.some(item => this.traverseChildren(item, targetNodeId));
  }

  tryOpenKupoprodajni() {
    this.kupoprodajni?.openDialogContract();
  }



  shiftStatus() {
    this.statusIndex = this.statusList.findIndex(s => s.includes(this.oglas.status));
    
    if(this.statusIndex == this.statusList.length -1) this.statusIndex = -1;

    this.oglas.status = this.statusList[++this.statusIndex];


  }

  resetStatus() {
    this.oglas.status = this.initialStatus;
  }
  confirmStatus(choice = false) {
    
    if(choice) {
      this.oglasService.updateOglasStatus({status: this.oglas.status, PkOglas: this.oglas.PkOglas}).subscribe((res:any) => {
        this.initialStatus = res.status;
        this.statusOverlayPanel.hide();
      }, err => {
        this.statusOverlayPanel.hide();
      });
    } else {
      this.oglas.status = this.initialStatus;
    }
  }

  saveStatus() {
    if(this.oglas.status == OglasStatus.NEAKTIVAN) {
      this.confirm.open('WARNING_NEAKTIVAN','warn', 'status');
      return;
    }

    if(this.oglas.status == OglasStatus.IZBRISAN) {
      this.confirm.open('WARNING_BRISANJE', 'danger', 'status');
      return;
    }
    if(this.oglas.status == OglasStatus.AKTIVAN) {
      this.oglasService.updateOglasStatus({status: this.oglas.status, PkOglas: this.oglas.PkOglas}).subscribe((res:any) => {
        this.initialStatus = res.status;
        this.statusOverlayPanel.hide();
      }, err => {
        this.statusOverlayPanel.hide();
      });
      return;
    }
  }

}
