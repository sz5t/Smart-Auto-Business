import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnFormSelectTreegridComponent } from './cn-form-select-treegrid.component';

describe('CnFormSelectTreegridComponent', () => {
  let component: CnFormSelectTreegridComponent;
  let fixture: ComponentFixture<CnFormSelectTreegridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnFormSelectTreegridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnFormSelectTreegridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
