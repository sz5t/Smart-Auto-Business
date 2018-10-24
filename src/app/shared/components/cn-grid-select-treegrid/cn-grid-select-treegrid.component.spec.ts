import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnGridSelectTreegridComponent } from './cn-grid-select-treegrid.component';

describe('CnGridSelectTreegridComponent', () => {
  let component: CnGridSelectTreegridComponent;
  let fixture: ComponentFixture<CnGridSelectTreegridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnGridSelectTreegridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnGridSelectTreegridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
