import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageChangerComponent } from './image-changer.component';

describe('ImageChangerComponent', () => {
  let component: ImageChangerComponent;
  let fixture: ComponentFixture<ImageChangerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageChangerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageChangerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
