import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BsnInlineCardSwipeComponent } from './bsn-inline-card-swipe.component';

describe('BsnInlineCardSwipeComponent', () => {
  let component: BsnInlineCardSwipeComponent;
  let fixture: ComponentFixture<BsnInlineCardSwipeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BsnInlineCardSwipeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BsnInlineCardSwipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
