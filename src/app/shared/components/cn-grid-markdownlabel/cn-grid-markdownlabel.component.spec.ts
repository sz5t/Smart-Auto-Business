import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CnGridMarkdownlabelComponent } from '@shared/components/cn-grid-markdownlabel/cn-grid-markdownlabel.component';

describe('CnGridMarkdownlabelComponent', () => {
  let component: CnGridMarkdownlabelComponent;
  let fixture: ComponentFixture<CnGridMarkdownlabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnGridMarkdownlabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnGridMarkdownlabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
