import { Component, OnInit, Inject } from "@angular/core";
import { MenuItem } from "primeng/api/menuitem";
import { Config } from "src/environments/config";
import { SPINNER } from "ngx-ui-loader";
import { ErrorHandler } from "./_services/errorHandler";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "buy-n-roll";
  display: boolean = false;
  items: MenuItem[];

  constructor(
    public config: Config,
    public errorHandler: ErrorHandler,
  ) {
    // SPINNER.rectangleBouncePulseOutRapid
  }

  public get SPINNER() {
    return SPINNER;
  }
  ngOnInit(): void {
    this.items = [
      {
        label: null,
        icon: "pi pi-arrow-right",
        command: () => (this.display = true)
      }
    ];
  }
}
