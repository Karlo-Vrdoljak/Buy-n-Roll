import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  displaySidebar:boolean = false;
  val = "asdf";
  landing:boolean = false;
  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        if(this.activatedRoute.snapshot['_routerState'].url == '/') {
          this.landing = true;
        } else {
          this.landing = false;
        }
          
          
      });
  }

  openSidebar() {
    this.displaySidebar = this.displaySidebar == false? true: false;
  }
  expression() {
    this.val = "kozel";
  }

}
