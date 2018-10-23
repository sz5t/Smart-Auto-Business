import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnGridSelectGridComponent } from './cn-grid-select-grid.component';

describe('CnGridSelectGridComponent', () => {
  let component: CnGridSelectGridComponent;
  let fixture: ComponentFixture<CnGridSelectGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnGridSelectGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnGridSelectGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
