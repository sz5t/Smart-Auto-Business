import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnGridSelectCustomMultipleComponent } from './cn-grid-select-custom-multiple.component';

describe('CnGridSelectCustomMultipleComponent', () => {
  let component: CnGridSelectCustomMultipleComponent;
  let fixture: ComponentFixture<CnGridSelectCustomMultipleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnGridSelectCustomMultipleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnGridSelectCustomMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
