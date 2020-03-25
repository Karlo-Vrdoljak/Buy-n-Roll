import { Component, OnInit, Inject } from '@angular/core';
import { TestService } from '../services/test.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ErrorHandler } from '../services/errorHandler';
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
      console.log(data);
      
    }, err => this.errorHandler.handleError(err));
    this.testService.getToken({ username: 'admin', password: 'admin' }).subscribe(data => {
      let auth = {...data};
      console.log(auth);
      this.storage.set('auth',auth);
      this.config.isLoggedIn = true;
      this.testService.testNestJWT().subscribe((data:any[]) => {
        this.user = data[0];
        console.log(this.user);
        
        this.message = data[1];
        
      },err => {
        this.errorHandler.handleError(err);
      }
      , () => { });
    });
    
  }

}
