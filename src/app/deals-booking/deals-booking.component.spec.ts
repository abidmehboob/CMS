import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsBookingComponent } from './deals-booking.component';

describe('DealsBookingComponent', () => {
  let component: DealsBookingComponent;
  let fixture: ComponentFixture<DealsBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealsBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealsBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
