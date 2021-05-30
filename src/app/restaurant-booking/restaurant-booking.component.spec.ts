import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantBookingComponent } from './restaurant-booking.component';

describe('RestaurantBookingComponent', () => {
  let component: RestaurantBookingComponent;
  let fixture: ComponentFixture<RestaurantBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
