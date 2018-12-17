import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TsDataTableComponent } from './ts-data-table.component';

describe('TsDataTableComponent', () => {
  let component: TsDataTableComponent;
  let fixture: ComponentFixture<TsDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TsDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TsDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
