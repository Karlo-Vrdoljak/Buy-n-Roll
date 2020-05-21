import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelPropComponent } from './model-prop.component';

describe('ModelPropComponent', () => {
  let component: ModelPropComponent;
  let fixture: ComponentFixture<ModelPropComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelPropComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelPropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
