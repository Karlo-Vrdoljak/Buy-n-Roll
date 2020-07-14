import { Component, OnInit, Input } from '@angular/core';
import { HelperService } from 'src/app/_services/helper.service';
import { Config } from 'src/environments/config';
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

  message:string = '';
  messageMaxLength:number = 150;

  constructor(public helperService: HelperService, public config: Config) { }

  ngOnInit(): void { }

}
