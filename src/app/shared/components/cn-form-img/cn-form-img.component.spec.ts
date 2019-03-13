import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnFormImgComponent } from './cn-form-img.component';

describe('CnFormImgComponent', () => {
  let component: CnFormImgComponent;
  let fixture: ComponentFixture<CnFormImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnFormImgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnFormImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
