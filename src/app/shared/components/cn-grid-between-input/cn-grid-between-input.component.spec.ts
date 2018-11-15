import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnGridBetweenInputComponent } from './cn-grid-between-input.component';

describe('CnGridBetweenInputComponent', () => {
  let component: CnGridBetweenInputComponent;
  let fixture: ComponentFixture<CnGridBetweenInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnGridBetweenInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnGridBetweenInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
