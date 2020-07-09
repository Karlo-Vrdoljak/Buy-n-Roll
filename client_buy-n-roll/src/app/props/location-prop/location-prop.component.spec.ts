import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationPropComponent } from './location-prop.component';

describe('LocationPropComponent', () => {
  let component: LocationPropComponent;
  let fixture: ComponentFixture<LocationPropComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationPropComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationPropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
