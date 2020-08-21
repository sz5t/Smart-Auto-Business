import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnVideoPlayComponent } from './cn-video-play.component';

describe('CnVideoPlayComponent', () => {
  let component: CnVideoPlayComponent;
  let fixture: ComponentFixture<CnVideoPlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnVideoPlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnVideoPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
