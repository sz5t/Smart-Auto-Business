import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JmEditorComponent } from './jm-editor.component';

describe('JmEditorComponent', () => {
  let component: JmEditorComponent;
  let fixture: ComponentFixture<JmEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JmEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JmEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
