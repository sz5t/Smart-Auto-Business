import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CALoginComponent } from './calogin.component';

describe('CALoginComponent', () => {
  let component: CALoginComponent;
  let fixture: ComponentFixture<CALoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CALoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CALoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
