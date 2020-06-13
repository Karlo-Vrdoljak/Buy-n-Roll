import { Component, OnInit, Input } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {

  @Input('breadcrumbs') breadcrumbs:MenuItem[];
  home:MenuItem;
  constructor() { }

  ngOnInit(): void {
    this.home = { icon:"fas fa-car", routerLink: '/' };

  }

}
