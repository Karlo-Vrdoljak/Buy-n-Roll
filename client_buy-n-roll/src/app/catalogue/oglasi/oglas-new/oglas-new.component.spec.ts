import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OglasNewComponent } from './oglas-new.component';

describe('OglasNewComponent', () => {
  let component: OglasNewComponent;
  let fixture: ComponentFixture<OglasNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OglasNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OglasNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
