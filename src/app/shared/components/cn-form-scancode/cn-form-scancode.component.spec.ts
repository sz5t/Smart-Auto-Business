import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnFormScancodeComponent } from './cn-form-scancode.component';

describe('CnFormScancodeComponent', () => {
  let component: CnFormScancodeComponent;
  let fixture: ComponentFixture<CnFormScancodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnFormScancodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnFormScancodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
