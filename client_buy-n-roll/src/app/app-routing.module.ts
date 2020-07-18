import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { TestComponentComponent } from './test-component/test-component.component';
import { LandingComponent } from './landing/landing.component';
import { LandingResolver } from './_resolvers/landing.resolver';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { CatalogueResolver } from './_resolvers/catalogue.resolver';
import { LoginComponent } from './login/login.component';
import { LastNavigation } from './_resolvers/last-navigation.resolver';
import { CatalogueItemViewComponent } from './catalogue/catalogue-item-view/catalogue-item-view.component';
import { CatalogueItemResolver } from './_resolvers/catalogue.item.resolver';
import { AuthGuardGuard } from './_guards/auth-guard.guard';
import { RegistrationComponent } from './registration/registration.component';
import { RegistrationResolver } from './_resolvers/registration.resolver';
import { DeniedPageComponent } from './denied-page/denied-page.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileResolver } from './_resolvers/profile.resolver';
import { OglasUserComponent } from './catalogue/oglasi/oglas-user/oglas-user.component';
import { OglasUserResolver } from './_resolvers/oglas-user.resolver';


const routes: Routes = [
  { path: 'test', component: TestComponentComponent, canActivate: [AuthGuardGuard] },
  { path: 'login', component: LoginComponent, resolve: {pageData: LastNavigation} },
  { path: 'registration', component: RegistrationComponent, resolve: {pageData: RegistrationResolver} },
  { path: 'denied', component: DeniedPageComponent, resolve: {pageData: LastNavigation} },
  { path: 'catalogues', component: CatalogueComponent, resolve: { pageData: CatalogueResolver} },
  { path: 'catalogues/:query', component: CatalogueComponent, resolve: { pageData: CatalogueResolver} },
  { path: 'catalogues/item/:query', component: CatalogueItemViewComponent, resolve: { pageData: CatalogueItemResolver} },
  { path: 'profile', component: ProfileComponent, resolve: { pageData: ProfileResolver}, /*canActivate: [AuthGuardGuard]*/ },
  { path: 'profile/:query', component: ProfileComponent, resolve: { pageData: ProfileResolver}, /*canActivate: [AuthGuardGuard]*/ },
  { path: 'oglasi', component: OglasUserComponent, resolve: { pageData: OglasUserResolver }, /*canActivate: [AuthGuardGuard]*/ },

  { path: '', component: LandingComponent, resolve: { pageData:LandingResolver } },
  { path: '**', redirectTo: '' },
];
// canActivate: [AuthGuard]
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
