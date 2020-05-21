import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesPropComponent } from './series-prop.component';

describe('SeriesPropComponent', () => {
  let component: SeriesPropComponent;
  let fixture: ComponentFixture<SeriesPropComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeriesPropComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesPropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
