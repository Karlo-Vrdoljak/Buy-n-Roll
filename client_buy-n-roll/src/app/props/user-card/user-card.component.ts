import { Component, OnInit, Input } from '@angular/core';
import { HelperService } from 'src/app/_services/helper.service';
import { NgsRevealService } from 'ngx-scrollreveal';
import { Router } from '@angular/router';
import { Config } from 'src/environments/config';
import { BaseClass } from 'src/app/_services/base.class';
import { User } from 'src/app/_types/user.interface';
import { Photo } from 'src/app/_types/oglas.interface';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent extends BaseClass implements OnInit {

  @Input('user') user: User;
  
  constructor(
    public helperService:HelperService,
    public revealService:NgsRevealService,
    public config:Config,
    public router:Router
  ) { super(config, helperService); }

  ngOnInit(): void {
    this.handleProfilePicture();
  }

  syncScrollReveal() {
    this.revealService.sync();
  }

  getPhotoUrlCssProfile() {
    return (this.user.photo.PkPhoto != -1? this.config.STATIC_FILES + this.user.username + '/' + this.user.photo.filename : this.user.photo.path);
  }

  private handleProfilePicture() {
    if(!this.user.photo?.filename) {
      this.user.photo = {
        PkPhoto: -1,
        path: "assets/images/misc/noProfile.png"
      } as Photo;
    }
  }

  navigateProfile() {
    this.router.navigate([ '/profile', {username: this.user.username} ]);
  }
  

}
