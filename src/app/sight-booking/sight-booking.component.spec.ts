import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SightBookingComponent } from './sight-booking.component';

describe('SightBookingComponent', () => {
  let component: SightBookingComponent;
  let fixture: ComponentFixture<SightBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SightBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SightBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
