import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnFormSelectCustomComponent } from './cn-form-select-custom.component';

describe('CnFormSelectCustomComponent', () => {
  let component: CnFormSelectCustomComponent;
  let fixture: ComponentFixture<CnFormSelectCustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnFormSelectCustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnFormSelectCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
