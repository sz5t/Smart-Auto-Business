import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnFormGridComponent } from './cn-form-grid.component';

describe('CnFormGridComponent', () => {
  let component: CnFormGridComponent;
  let fixture: ComponentFixture<CnFormGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnFormGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnFormGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
