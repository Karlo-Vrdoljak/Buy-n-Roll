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
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { BreadcrumbService } from './_services/breadcrumb.service';
import { DataViewModule } from 'primeng/dataview';
import { LoginComponent } from './login/login.component';
import { UserService } from './_services/user.service';
import { LastNavigation } from './_resolvers/last-navigation.resolver';
import { CatalogueSearchItemComponent } from './catalogue/catalogue-search-item/catalogue-search-item.component';
import { CountUpModule } from 'ngx-countup';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CatalogueItemViewComponent } from './catalogue/catalogue-item-view/catalogue-item-view.component';
import { CatalogueItemResolver } from './_resolvers/catalogue.item.resolver';
import { CatalogueActionIconsComponent } from './catalogue/catalogue-action-icons/catalogue-action-icons.component';
import {TextFieldModule} from '@angular/cdk/text-field';
import { RegistrationComponent } from './registration/registration.component';
import { RegistrationResolver } from './_resolvers/registration.resolver';
import { ErrorPageComponent } from './error-page/error-page.component';
import { DeniedPageComponent } from './denied-page/denied-page.component';
import {KeyFilterModule} from 'primeng/keyfilter';
import {DialogModule} from 'primeng/dialog';
import { LocationPropComponent } from './props/location-prop/location-prop.component';
import {IMaskModule} from 'angular-imask';
import { PolicyComponent } from './policy/policy.component';
import { ProgressBarModule } from 'primeng/progressbar';
import {FileUploadModule} from 'primeng/fileupload';
import { AccConfirmComponent } from './registration/acc-confirm/acc-confirm.component';
import { ProfileComponent } from './profile/profile.component';
import { BaseClass } from './_services/base.class';
import { ProfileResolver } from './_resolvers/profile.resolver';
import { ImageChangerComponent } from './props/image-changer/image-changer.component';
import { OglasUserComponent } from './catalogue/oglasi/oglas-user/oglas-user.component';
import { OglasUserResolver } from './_resolvers/oglas-user.resolver';
import { OglasEditComponent } from './catalogue/oglasi/oglas-edit/oglas-edit.component';
import { OglasEditResolver } from './_resolvers/oglas-edit.resolver';
import { AppResolver } from './_resolvers/app.resolver';
import {ChipsModule} from 'primeng/chips';
import {InputSwitchModule} from 'primeng/inputswitch';
import { GalleryModule } from  '@ngx-gallery/core';
import { LightboxModule } from  '@ngx-gallery/lightbox';
import { GallerizeModule } from  '@ngx-gallery/gallerize';
import { GalleryComponent } from './props/gallery/gallery.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import { ConfirmDialogComponent } from './props/confirm-dialog/confirm-dialog.component';
import { OglasNewComponent } from './catalogue/oglasi/oglas-new/oglas-new.component';
import { OglasNewResolver } from './_resolvers/oglas-new.resolver';
import { FavouritesComponent } from './catalogue/favourites/favourites.component';
import { FavouritesResolver } from './_resolvers/favourites.resolver';
import { UserCardComponent } from './props/user-card/user-card.component';
import { FavouritesAdsResolver } from './_resolvers/favourites.ads.resolver';
import { AdvancedSearchComponent } from './props/advanced-search/advanced-search.component';
import {SliderModule} from 'primeng/slider';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { KupoprodajniComponent } from './props/kupoprodajni/kupoprodajni.component';
import {TableModule} from 'primeng/table';


const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: "#ffcd39",
  fgsColor: "#ffcd39",
  overlayColor: "#00000000",
  bgsPosition: POSITION.bottomRight,
  bgsSize: 40,
  bgsType: SPINNER.chasingDots, // background spinner type
  fgsType: SPINNER.cubeGrid, // foreground spinner type
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbColor: '#feda6a',
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
    BreadcrumbsComponent,
    LoginComponent,
    CatalogueSearchItemComponent,
    CatalogueItemViewComponent,
    CatalogueActionIconsComponent,
    RegistrationComponent,
    ErrorPageComponent,
    DeniedPageComponent,
    LocationPropComponent,
    PolicyComponent,
    AccConfirmComponent,
    ProfileComponent,
    ImageChangerComponent,
    OglasUserComponent,
    OglasEditComponent,
    GalleryComponent,
    ConfirmDialogComponent,
    OglasNewComponent,
    FavouritesComponent,
    UserCardComponent,
    AdvancedSearchComponent,
    KupoprodajniComponent,
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
    MatBadgeModule,
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
    BreadcrumbModule,
    DataViewModule,
    CountUpModule,
    MatDividerModule,
    SplitButtonModule,
    TextFieldModule,
    KeyFilterModule,
    DialogModule,
    IMaskModule,
    ProgressBarModule,
    FileUploadModule,
    ChipsModule,
    InputSwitchModule,
    GalleryModule.withConfig({
      dots:true,
      imageSize: "contain",
      autoPlay:true,
      gestures: true,
      loop:true
    }),
    LightboxModule.withConfig({
      keyboardShortcuts: true,
    }),
    GallerizeModule,
    ConfirmDialogModule,
    SliderModule,
    OverlayPanelModule,
    TableModule
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
    SearchService,
    BreadcrumbService,
    UserService,
    LastNavigation,
    CatalogueItemResolver,
    RegistrationResolver,
    BaseClass,
    ProfileResolver,
    OglasUserResolver,
    OglasEditResolver,
    AppResolver,
    ConfirmationService,
    OglasNewResolver,
    FavouritesResolver,
    FavouritesAdsResolver
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}