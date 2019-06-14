import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnFormMarkdownlabelComponent } from './cn-form-markdown.component';

describe('CnFormMarkdownlabelComponent', () => {
  let component: CnFormMarkdownlabelComponent;
  let fixture: ComponentFixture<CnFormMarkdownlabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnFormMarkdownlabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnFormMarkdownlabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
