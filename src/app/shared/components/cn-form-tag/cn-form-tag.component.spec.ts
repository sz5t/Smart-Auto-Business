import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnFormTagComponent } from './cn-form-tag.component';

describe('CnFormTagComponent', () => {
  let component: CnFormTagComponent;
  let fixture: ComponentFixture<CnFormTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnFormTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnFormTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
