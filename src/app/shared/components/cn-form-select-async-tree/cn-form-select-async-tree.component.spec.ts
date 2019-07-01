import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnFormSelectAsyncTreeComponent } from './cn-form-select-async-tree.component';

describe('CnFormSelectAsyncTreeComponent', () => {
  let component: CnFormSelectAsyncTreeComponent;
  let fixture: ComponentFixture<CnFormSelectAsyncTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnFormSelectAsyncTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnFormSelectAsyncTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
