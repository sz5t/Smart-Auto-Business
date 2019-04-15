import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnGridSapnComponent } from './cn-grid-sapn.component';

describe('CnGridSapnComponent', () => {
  let component: CnGridSapnComponent;
  let fixture: ComponentFixture<CnGridSapnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnGridSapnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnGridSapnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
