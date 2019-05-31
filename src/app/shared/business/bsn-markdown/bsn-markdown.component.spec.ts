import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BsnMarkdownComponent } from './bsn-markdown.component';

describe('BsnMarkdownComponent', () => {
  let component: BsnMarkdownComponent;
  let fixture: ComponentFixture<BsnMarkdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BsnMarkdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BsnMarkdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
