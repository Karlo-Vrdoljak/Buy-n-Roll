import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss']
})
export class PolicyComponent implements OnInit {

  displayDlgPolicy = false;
  displayDlgTerms = false;
  
  constructor(public translate: TranslateService) { }

  ngOnInit(): void {
  }

}
