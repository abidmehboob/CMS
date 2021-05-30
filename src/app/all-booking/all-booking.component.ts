import { ListingService } from './../core/services/listing-service/listing.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../core/services/notification-service/notification.service';
import { ApiResponse } from '../shared/models/response.model';
import { environment } from './../../environments/environment';
import * as $ from 'jquery';
declare var $: any;
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-all-booking',
  templateUrl: './all-booking.component.html',
  styleUrls: ['./all-booking.component.css']
})
export class AllBookingComponent implements OnInit {
  @ViewChild('myTable') table: DatatableComponent;

  rows: any = [];
  temp = []
  subscriptions: Subscription[] = [];
  imgBase = ""
  bgImg = "";

  constructor(
    private notifyService: NotificationService,
    private listingService: ListingService,

  ) { 
    this.imgBase = environment.imageBase+"file_uploads/hotel_images/";
    this.bgImg = localStorage.getItem('mg') ? localStorage.getItem('mg') : "";

    this.listingService.getAllBooking();
    this.subscriptions[0] = this.listingService.bookingData$.subscribe(
      (data) => {
        console.log(data)
        if (data && data.length > 0) {
          this.rows = data;
          this.temp = [...data]
        }
      }
    );

  }
  actionPerform(ac,id){
    let newObject = {
      booking_id : id,
      booking_status : ac
    };
    let modules = 'bookings';
    this.listingService.statusUpdate(modules,newObject).subscribe(
      (res: ApiResponse) => {
        if (res) {
          this.listingService.getAllHotelBooking();
          this.notifyService.showSuccess(
            'Status succesfully updated.',
            'Success!'
          );
        
  
        } else {
        
          this.notifyService.showWarning(
            'Failed to change the status',
            'Error!'
          );
        }
      },
      (err) => {
      
        this.notifyService.showWarning(err.error.error, 'Error');
      }
    );    

  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return ((d.listingTitle.toLowerCase().indexOf(val) !== -1 || !val));
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }  

  ngOnInit(): void {
  }

}
