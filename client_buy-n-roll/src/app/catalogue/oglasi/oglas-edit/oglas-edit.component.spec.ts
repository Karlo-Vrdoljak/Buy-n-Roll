import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OglasEditComponent } from './oglas-edit.component';

describe('OglasEditComponent', () => {
  let component: OglasEditComponent;
  let fixture: ComponentFixture<OglasEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OglasEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OglasEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
