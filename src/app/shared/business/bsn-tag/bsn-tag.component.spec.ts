import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BsnTagComponent } from './bsn-tag.component';

describe('BsnTagComponent', () => {
  let component: BsnTagComponent;
  let fixture: ComponentFixture<BsnTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BsnTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BsnTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
