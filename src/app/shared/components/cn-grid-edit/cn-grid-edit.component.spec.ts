import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnGridEditComponent } from './cn-grid-edit.component';

describe('CnGridEditComponent', () => {
  let component: CnGridEditComponent;
  let fixture: ComponentFixture<CnGridEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnGridEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnGridEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
