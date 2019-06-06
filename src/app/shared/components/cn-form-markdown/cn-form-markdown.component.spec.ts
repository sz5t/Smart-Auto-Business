import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnFormMarkdownComponent } from './cn-form-markdown.component';

describe('CnFormMarkdownComponent', () => {
  let component: CnFormMarkdownComponent;
  let fixture: ComponentFixture<CnFormMarkdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnFormMarkdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnFormMarkdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
