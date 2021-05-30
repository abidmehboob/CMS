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
  selector: 'app-privatehired-booking',
  templateUrl: './privatehired-booking.component.html',
  styleUrls: ['./privatehired-booking.component.css']
})
export class PrivatehiredBookingComponent implements OnInit {
  @ViewChild('myTable') table: DatatableComponent;

  rows: any = [];
  temp = []
  subscriptions: Subscription[] = [];

  constructor(
    private notifyService: NotificationService,
    private listingService: ListingService,

  ) { 
    this.listingService.getAllPrivatehiredBooking();
    this.subscriptions[0] = this.listingService.privatehiredBookingData$.subscribe(
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
      private_hired_booking_id : id,
      booking_status : ac
    };
    let modules = 'privatevehicles/booking';
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
  
  ngOnInit(): void {
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

}
