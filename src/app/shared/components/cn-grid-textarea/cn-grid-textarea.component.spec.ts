import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnGridTextareaComponent } from './cn-grid-textarea.component';

describe('CnGridTextareaComponent', () => {
  let component: CnGridTextareaComponent;
  let fixture: ComponentFixture<CnGridTextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnGridTextareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnGridTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
