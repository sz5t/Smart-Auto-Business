import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnGridSearchComponent } from './cn-grid-search.component';

describe('CnGridSearchComponent', () => {
  let component: CnGridSearchComponent;
  let fixture: ComponentFixture<CnGridSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnGridSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnGridSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
