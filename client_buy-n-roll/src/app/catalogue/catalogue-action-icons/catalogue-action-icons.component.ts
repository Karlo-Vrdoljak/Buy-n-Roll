import { Component, OnInit, Input } from '@angular/core';
import { HelperService } from 'src/app/_services/helper.service';
import { Config } from 'src/environments/config';
import { Router } from '@angular/router';
@Component({
  selector: 'app-catalogue-action-icons',
  templateUrl: './catalogue-action-icons.component.html',
  styleUrls: ['./catalogue-action-icons.component.scss']
})
export class CatalogueActionIconsComponent implements OnInit {

  @Input('external') external:boolean = true;
  @Input('PkOglas') PkOglas:number;
  @Input('rating') rating:number;
  delay = [80, 130, 210, 340, 550, 890];
  @Input('msgShade') msgShade:number = 200;
  @Input('offset') offset:number = 0.25;
  @Input('ignoreRating') ignoreRating :boolean = false;
  @Input('ignoreContact') ignoreContact :boolean = false;
  @Input('editLink') editLink:boolean = false;
  @Input('username') username:string = null;

  message:string = '';
  messageMaxLength:number = 150;

  constructor(public helperService: HelperService, public config: Config, private router:Router) { }

  ngOnInit(): void {

    console.log(this.username);
    console.log(this.editLink, this.ignoreContact);

  }
  

  reloadState(contact:boolean = false, edit:boolean = false,rating = false) {
    this.editLink = contact;
    this.ignoreContact = edit;
    this.ignoreRating = rating;
    console.log(this.editLink, this.ignoreContact);
    
  }
  rerouteEdit() {
    console.log(this.PkOglas, this.username);
    
    this.router.navigate(['/catalogues/item/edit/', this.PkOglas], {queryParams: {username: this.username}});
  }

}
