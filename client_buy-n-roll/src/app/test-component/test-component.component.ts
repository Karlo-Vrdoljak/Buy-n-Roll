import { Component, OnInit, Inject } from '@angular/core';
import { TestService } from '../_services/test.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ErrorHandler } from '../_services/errorHandler';
import { LocalStorageService, SessionStorageService, LocalStorage, SessionStorage } from 'angular-web-storage';
import { Config } from 'src/environments/config';

@Component({
  selector: 'app-test-component',
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.scss']
})
export class TestComponentComponent implements OnInit {
  message:any;
  user: any;
  constructor(
    public testService: TestService,
    private ngxLoader: NgxUiLoaderService,
    public errorHandler: ErrorHandler,
    public storage:LocalStorageService,
    public config:Config
  ) { }

  ngOnInit() {
    this.testService.testNestJSApi().subscribe(data => {
      
    }, );
    this.testService.getToken({ username: 'admin', password: 'admin' }).subscribe((data:any) => {
      let auth = {...data};
      this.storage.set('auth',auth);
      this.config.isLoggedIn = true;
      this.testService.testNestJWT().subscribe((data:any[]) => {
        this.user = data[0];
        
        this.message = data[1];
        
      },err => {

      }
      , () => { });
    });
    
  }

}
