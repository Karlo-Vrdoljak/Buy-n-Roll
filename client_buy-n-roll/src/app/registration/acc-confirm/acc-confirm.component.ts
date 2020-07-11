import { Component, OnInit, ViewChild, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { NgModel } from '@angular/forms';
import { fadeInRightOnEnterAnimation, fadeOutLeftOnLeaveAnimation } from 'angular-animations';
import { map, debounceTime } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { Config } from 'src/environments/config';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-acc-confirm',
  templateUrl: './acc-confirm.component.html',
  styleUrls: ['./acc-confirm.component.scss'],
  animations: [
    fadeInRightOnEnterAnimation(),
    fadeOutLeftOnLeaveAnimation(),
  ]
})
export class AccConfirmComponent implements OnInit, OnDestroy {

  displayDlgAcc = true;

  keyUpCode = new Subject<KeyboardEvent>();
  keyUpCodeSub:Subscription;
  @ViewChild('codeInput') codeInput:NgModel;
  code:string;
  @Input() username:string = null;

  @Output() onConfirm = new EventEmitter<any>();

  constructor(
    private loader:NgxUiLoaderService,
    private router:Router,
    private config:Config,
    private userService:UserService
  ) { }
  ngOnDestroy(): void {
    this.keyUpCodeSub.unsubscribe();
  }

  ngOnInit(): void {
    this.setupDebounceKeys();
  }

  setupDebounceKeys() {
    this.keyUpCodeSub = this.keyUpCode.pipe(
      map(event => event),
      debounceTime(400),
    ).subscribe(res => {
      this.loader.startLoader('acc_confirm_loader');
      this.checkCode();
    });
  }

  checkCode() {
    if(this.username == null) {
      this.userService.checkToken().then(result => {
        if(result == false) {
          this.loader.stopLoader('acc_confirm_loader');
          window.location.replace(window.location.href.split('/#/')[0]);
        } else {
          this.confirmIfCodeValid(this.config.user.username);
        }
      });
    } else {
      this.confirmIfCodeValid(this.username);
    }
  }

  confirmIfCodeValid(username:string) {
    this.userService.checkCodeByUsername({username: username, code: this.code}).subscribe(data => {
      this.displayDlgAcc = false;
      this.loader.stopLoader('acc_confirm_loader');
      this.onConfirm.emit(true);
    }, err => {
      this.displayDlgAcc = false;
      this.loader.stopLoader('acc_confirm_loader');
      this.onConfirm.emit(false);
    });
  }

}
