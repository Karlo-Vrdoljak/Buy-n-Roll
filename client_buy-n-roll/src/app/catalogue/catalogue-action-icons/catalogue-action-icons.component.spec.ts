import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueActionIconsComponent } from './catalogue-action-icons.component';

describe('CatalogueActionIconsComponent', () => {
  let component: CatalogueActionIconsComponent;
  let fixture: ComponentFixture<CatalogueActionIconsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogueActionIconsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogueActionIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
