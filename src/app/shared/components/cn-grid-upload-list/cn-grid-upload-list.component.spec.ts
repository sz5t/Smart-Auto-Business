import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnGridUploadComponent } from './cn-grid-upload.component';

describe('CnGridUploadComponent', () => {
  let component: CnGridUploadComponent;
  let fixture: ComponentFixture<CnGridUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnGridUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnGridUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
