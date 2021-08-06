import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Spline2Component } from './spline2.component';

describe('Spline2Component', () => {
  let component: Spline2Component;
  let fixture: ComponentFixture<Spline2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Spline2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Spline2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
