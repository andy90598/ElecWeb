import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Spline1Component } from './spline1.component';

describe('Spline1Component', () => {
  let component: Spline1Component;
  let fixture: ComponentFixture<Spline1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Spline1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Spline1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
