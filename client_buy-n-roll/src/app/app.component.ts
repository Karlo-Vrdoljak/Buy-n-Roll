import { Component, OnInit, Inject, NgZone } from "@angular/core";
import { MenuItem } from "primeng/api/menuitem";
import { Config } from "src/environments/config";
import { SPINNER } from "ngx-ui-loader";
import { TranslateService } from "@ngx-translate/core";
import { ErrorHandler } from "./_services/errorHandler";
import { LocalStorageService } from "angular-web-storage";
import { UserService } from './_services/user.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "buy-n-roll";
  display: boolean = false;
  items: MenuItem[];

  constructor(
    public config: Config,
    public errorHandler: ErrorHandler,
    public translate: TranslateService,
    public storage: LocalStorageService,
    private userService: UserService,
  ) {
    // SPINNER.rectangleBouncePulseOutRapid
  }

  public get SPINNER() {
    return SPINNER;
  }
  ngOnInit(): void {
    this.userService.checkToken();
    let lang = this.storage.get("buynroll_lang");
    if (!lang) {
      this.translate.setDefaultLang("hr");
      this.translate.use("hr");
      this.storage.set("buynroll_lang",'hr');
    } else {
      this.translate.setDefaultLang(lang);
      this.translate.use(lang);

    }
    this.items = [
      {
        label: null,
        icon: "pi pi-arrow-right",
        command: () => (this.display = true),
      },
    ];
  }


}
