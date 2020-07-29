import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from "@angular/core";
import { HelperService } from "src/app/_services/helper.service";
import { Config } from "src/environments/config";
import { Router } from "@angular/router";
import { UserService } from "src/app/_services/user.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from 'rxjs';
@Component({
  selector: "app-catalogue-action-icons",
  templateUrl: "./catalogue-action-icons.component.html",
  styleUrls: ["./catalogue-action-icons.component.scss"],
})
export class CatalogueActionIconsComponent implements OnInit, OnDestroy {
  @Input("external") external: boolean = true;
  @Input("PkOglas") PkOglas: number;
  @Input("rating") rating: number;
  delay = [80, 130, 210, 340, 550, 890];
  @Input("msgShade") msgShade: number = 200;
  @Input("offset") offset: number = 0.25;
  @Input("ignoreRating") ignoreRating: boolean = false;
  @Input("ignoreContact") ignoreContact: boolean = false;
  @Input("editLink") editLink: boolean = false;
  @Input("username") username: string = null;
  @Input("allFavs") allFavs: boolean = false;
  @Input("alreadyFav") alreadyFav: boolean = undefined;
  @Output() onRemoveOglasFavourite = new EventEmitter<number>();
  @Input('phone') phone: string;
  @Input('email') email: string;

  loginSub: Subscription;
  message: string = "";

  constructor(
    public helperService: HelperService,
    private translate: TranslateService,
    public config: Config,
    private router: Router,
    private userService: UserService,
    private toast: ToastrService
  ) {}
  ngOnDestroy(): void {
    this.loginSub.unsubscribe();
  }

  ngOnInit(): void {
    this.loginSub = this.helperService.currentLogin.subscribe(data => {
      this.alreadyFav = this.config.user?.username? this.alreadyFav : undefined;
    });

  }

  reloadState(contact: boolean = false, edit: boolean = false, rating = false) {
    this.editLink = contact;
    this.ignoreContact = edit;
    this.ignoreRating = rating;
  }
  rerouteEdit() {
    this.router.navigate(["/catalogues/item/edit/", this.PkOglas], {
      queryParams: { username: this.username },
    });
  }

  handleAddToFav() {
    
    if(this.config.user?.username == this.username) {
      if(this.rating > 0) this.router.navigate([ '/catalogues/favourites/', this.PkOglas ]);
      return;
    }
    this.userService.checkToken().then((result) => {
      if (result == true) {
        this.userService.toggleToFav({PkOglas: this.PkOglas}).subscribe(result => {
          if(result == true) {
            this.rating = +this.rating + 1;
            this.alreadyFav = true;
          } else {
            this.rating = +this.rating - 1;
            this.alreadyFav = false;
            this.onRemoveOglasFavourite.emit(this.PkOglas);
          }
        });
      } else {
        this.toast.info(this.translate.instant('FAV_ERR_LOGIN'), null, {timeOut: 5000});
      }
    });
  }
}
