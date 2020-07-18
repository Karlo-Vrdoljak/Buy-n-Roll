import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OglasUserComponent } from './oglas-user.component';

describe('OglasUserComponent', () => {
  let component: OglasUserComponent;
  let fixture: ComponentFixture<OglasUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OglasUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OglasUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
