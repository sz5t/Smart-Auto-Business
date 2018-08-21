import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BsnUploadComponent } from './bsn-upload.component';

describe('BsnUploadComponent', () => {
  let component: BsnUploadComponent;
  let fixture: ComponentFixture<BsnUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BsnUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BsnUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
