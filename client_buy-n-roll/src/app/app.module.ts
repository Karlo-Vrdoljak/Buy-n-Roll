import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { TestService } from "./_services/test.service";
import { TestComponentComponent } from "./test-component/test-component.component";
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from "@angular/common/http";
import { AccordionModule } from "primeng/accordion";
import { PanelModule } from "primeng/panel";
import { ButtonModule } from "primeng/button";
import { RadioButtonModule } from "primeng/radiobutton";
import { FormsModule } from "@angular/forms";
import { SidebarModule } from "primeng/sidebar";
import { MenubarModule } from "primeng/menubar";
import { Config } from "src/environments/config";
import { CarouselModule } from "primeng/carousel";
import { NgxUiLoaderModule,NgxUiLoaderService,NgxUiLoaderConfig,SPINNER,POSITION,PB_DIRECTION,NgxUiLoaderHttpModule,NgxUiLoaderRouterModule } from "ngx-ui-loader";
import { AppHttpInterceptor } from "./_services/httpInterceptor";
import { ErrorHandler } from "./_services/errorHandler";
import { CommonModule } from "@angular/common";
import { ToastrModule } from "ngx-toastr";
import { AngularWebStorageModule } from "angular-web-storage";
import { TopbarComponent } from "./topbar/topbar.component";
import { ToolbarModule } from "primeng/toolbar";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { LandingComponent } from "./landing/landing.component";
import { InputTextModule } from "primeng/inputtext";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { SwiperModule } from "ngx-swiper-wrapper";
import { HelperService } from "./_services/helper.service";
import { NgxParallaxScrollModule } from "ngx-parallax-scroll";
import { NgsRevealModule } from "ngx-scrollreveal";
import { MatStepperModule } from "@angular/material/stepper";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LandingResolver } from './_resolvers/landing.resolver';
import { VehicleService } from './_services/vehicle.service';
import { ManufacturerPropComponent } from './props/manufacturer-prop/manufacturer-prop.component';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { DropdownModule } from 'primeng/dropdown';
import { ListboxModule } from 'primeng/listbox';
import { SeriesPropComponent } from './props/series-prop/series-prop.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { ModelPropComponent } from './props/model-prop/model-prop.component';
import { MatButtonModule } from '@angular/material/button';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { TranslationList } from './_services/translation.list';
import { CatalogueResolver } from './_resolvers/catalogue.resolver';
import { SearchService } from './_services/search.service';



const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: "#ffcd39",
  fgsColor: "#1f7ed0",
  overlayColor: "#00000000",
  bgsPosition: POSITION.bottomRight,
  bgsSize: 40,
  bgsType: SPINNER.chasingDots, // background spinner type
  fgsType: SPINNER.cubeGrid, // foreground spinner type
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbThickness: 5, // progress bar thickness
};

@NgModule({
  declarations: [
    AppComponent,
    TestComponentComponent,
    TopbarComponent,
    LandingComponent,
    ManufacturerPropComponent,
    SeriesPropComponent,
    ModelPropComponent,
    CatalogueComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AngularWebStorageModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AccordionModule,
    PanelModule,
    ButtonModule,
    RadioButtonModule,
    SidebarModule,
    MenubarModule,
    NgxUiLoaderRouterModule.forRoot({
      ...ngxUiLoaderConfig,
      showForeground: true,
    }),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    CarouselModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      countDuplicates: true,
      progressBar: true,
      progressAnimation: "decreasing",
      positionClass: "toast-bottom-left",
      enableHtml: true,
      timeOut: 2000
    }),
    ToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    InputTextModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    }),
    SwiperModule,
    NgxParallaxScrollModule,
    NgsRevealModule,
    MatStepperModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    VirtualScrollerModule,
    DropdownModule,
    ListboxModule,
    MatRippleModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    MatButtonModule,
    
  ],
  providers: [
    TestService,
    NgxUiLoaderService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    Config,
    { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true },
    ErrorHandler,
    HelperService,
    LandingResolver,
    CatalogueResolver,
    VehicleService,
    TranslationList,
    SearchService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}