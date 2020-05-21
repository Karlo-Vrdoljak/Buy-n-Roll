import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerPropComponent } from './manufacturer-prop.component';

describe('ManufacturerPropComponent', () => {
  let component: ManufacturerPropComponent;
  let fixture: ComponentFixture<ManufacturerPropComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufacturerPropComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturerPropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
