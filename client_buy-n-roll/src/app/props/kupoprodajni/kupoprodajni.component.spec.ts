import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KupoprodajniComponent } from './kupoprodajni.component';

describe('KupoprodajniComponent', () => {
  let component: KupoprodajniComponent;
  let fixture: ComponentFixture<KupoprodajniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KupoprodajniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KupoprodajniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
