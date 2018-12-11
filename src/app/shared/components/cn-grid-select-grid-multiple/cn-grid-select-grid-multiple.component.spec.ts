import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnGridSelectGridMultipleComponent } from './cn-grid-select-grid-multiple.component';

describe('CnGridSelectGridMultipleComponent', () => {
  let component: CnGridSelectGridMultipleComponent;
  let fixture: ComponentFixture<CnGridSelectGridMultipleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnGridSelectGridMultipleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnGridSelectGridMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
