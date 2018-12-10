import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnFormInputSelectComponent } from './cn-form-input-select.component';

describe('CnFormInputSelectComponent', () => {
  let component: CnFormInputSelectComponent;
  let fixture: ComponentFixture<CnFormInputSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnFormInputSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnFormInputSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
