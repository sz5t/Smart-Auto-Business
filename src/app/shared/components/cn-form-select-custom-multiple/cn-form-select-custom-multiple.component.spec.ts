import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnFormSelectCustomMultipleComponent } from './cn-form-select-custom-multiple.component';

describe('CnFormSelectCustomMultipleComponent', () => {
  let component: CnFormSelectCustomMultipleComponent;
  let fixture: ComponentFixture<CnFormSelectCustomMultipleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnFormSelectCustomMultipleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnFormSelectCustomMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
