import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueItemViewComponent } from './catalogue-item-view.component';

describe('CatalogueItemViewComponent', () => {
  let component: CatalogueItemViewComponent;
  let fixture: ComponentFixture<CatalogueItemViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogueItemViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogueItemViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
