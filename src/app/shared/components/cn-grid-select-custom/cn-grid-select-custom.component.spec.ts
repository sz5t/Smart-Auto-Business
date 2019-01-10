import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnGridSelectCustomComponent } from './cn-grid-select-custom.component';

describe('CnGridSelectCustomComponent', () => {
  let component: CnGridSelectCustomComponent;
  let fixture: ComponentFixture<CnGridSelectCustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnGridSelectCustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnGridSelectCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
