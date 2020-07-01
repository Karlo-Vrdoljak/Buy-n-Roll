import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { TestComponentComponent } from './test-component/test-component.component';
import { LandingComponent } from './landing/landing.component';
import { LandingResolver } from './_resolvers/landing.resolver';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { CatalogueResolver } from './_resolvers/catalogue.resolver';
import { LoginComponent } from './login/login.component';
import { LoginResolver } from './_resolvers/login.resolver';
import { CatalogueItemViewComponent } from './catalogue/catalogue-item-view/catalogue-item-view.component';
import { CatalogueItemResolver } from './_resolvers/catalogue.item.resolver';


const routes: Routes = [
  { path: 'test', component: TestComponentComponent },
  { path: 'login', component: LoginComponent, resolve: {pageData: LoginResolver} },
  { path: 'catalogues', component: CatalogueComponent, resolve: { pageData: CatalogueResolver} },
  { path: 'catalogues/:query', component: CatalogueComponent, resolve: { pageData: CatalogueResolver} },
  { path: 'catalogues/item/:query', component: CatalogueItemViewComponent, resolve: { pageData: CatalogueItemResolver} },
  { path: '', component: LandingComponent, resolve: { pageData:LandingResolver } },
  { path: '**', redirectTo: '' },
];
// canActivate: [AuthGuard]
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
