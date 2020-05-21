import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { TestComponentComponent } from './test-component/test-component.component';
import { LandingComponent } from './landing/landing.component';
import { LandingResolver } from './_resolvers/landing.resolver';


const routes: Routes = [
  { path: 'test', component: TestComponentComponent },
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
