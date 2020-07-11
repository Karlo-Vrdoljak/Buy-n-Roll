import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccConfirmComponent } from './acc-confirm.component';

describe('AccConfirmComponent', () => {
  let component: AccConfirmComponent;
  let fixture: ComponentFixture<AccConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
