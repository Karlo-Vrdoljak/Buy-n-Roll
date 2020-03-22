import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  displaySidebar:boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  openSidebar() {
    this.displaySidebar = this.displaySidebar == false? true: false;
  }

}
