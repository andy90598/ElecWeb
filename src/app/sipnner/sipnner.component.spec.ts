import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SipnnerComponent } from './sipnner.component';

describe('SipnnerComponent', () => {
  let component: SipnnerComponent;
  let fixture: ComponentFixture<SipnnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SipnnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SipnnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
