import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnFormSelectGridMultipleComponent } from './cn-form-select-grid-multiple.component';

describe('CnFormSelectGridMultipleComponent', () => {
  let component: CnFormSelectGridMultipleComponent;
  let fixture: ComponentFixture<CnFormSelectGridMultipleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnFormSelectGridMultipleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnFormSelectGridMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
