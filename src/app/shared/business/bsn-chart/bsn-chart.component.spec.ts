import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BsnChartComponent } from './bsn-chart.component';

describe('BsnChartComponent', () => {
  let component: BsnChartComponent;
  let fixture: ComponentFixture<BsnChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BsnChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BsnChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
