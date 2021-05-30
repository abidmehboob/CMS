import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivatehiredBookingComponent } from './privatehired-booking.component';

describe('PrivatehiredBookingComponent', () => {
  let component: PrivatehiredBookingComponent;
  let fixture: ComponentFixture<PrivatehiredBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivatehiredBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivatehiredBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
