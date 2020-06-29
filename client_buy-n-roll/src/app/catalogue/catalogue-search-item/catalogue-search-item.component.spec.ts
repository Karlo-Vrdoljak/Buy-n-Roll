import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueSearchItemComponent } from './catalogue-search-item.component';

describe('CatalogueSearchItemComponent', () => {
  let component: CatalogueSearchItemComponent;
  let fixture: ComponentFixture<CatalogueSearchItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogueSearchItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogueSearchItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
