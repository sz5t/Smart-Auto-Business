import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnGridVideoComponent } from './cn-grid-video.component';

describe('CnGridVideoComponent', () => {
  let component: CnGridVideoComponent;
  let fixture: ComponentFixture<CnGridVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnGridVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnGridVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
