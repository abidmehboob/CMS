import { SubadminService } from './../../core/services/subadmin-service/subadmin.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SigninService } from './../../core/services/signin-service/signin.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  permissions: any  = {}
  subscriptions: Subscription[] = [];

  constructor(private router : Router,private subadminService: SubadminService, private  signinService :SigninService) {
    this.subscriptions[1] =  this.signinService.roles$.subscribe(resp=>{
      if(resp){
        this.permissions = resp.permission;

      }
    });
   // this.subadminService.getSubadminPermissions()
   let permissionData =  [{
    "id": 1,
    "name": "SuperAdmin",
    "type": "SuperAdmin",
    "permission": {
      "dashboard": true,
      "subadmins": true,
      "hotel": true,
      "booking": true,
      "sightseeing": true,
      "privatevehicle": true,
      "deals": true,
      "hotelBooking": true,
      "sightBooking": true,
      "restaurantBooking": true,
      "privatehiredBooking": true
  
    }
  }, {
    "id": 2,
    "name": "Admin",
    "type": "Admin",
    "permission": {
      "dashboard": true,
      "subadmins": true,
      "hotel": true,
      "booking": true,
      "sightseeing": true,
      "privatevehicle": true,
      "deals": true,
      "hotelBooking": true,
      "sightBooking": true,
      "restaurantBooking": true,
      "privatehiredBooking": true
  
    }
  
  }, {
    "id": 3,
    "name": "HotelManager",
    "type": "HotelManager",
    "permission": {
      "dashboard": true,
      "subadmins": true,
      "hotel": true,
      "booking": true,
      "sightseeing": true,
      "privatevehicle": true,
      "deals": true,
      "hotelBooking": true,
      "sightBooking": true,
      "restaurantBooking": true,
      "privatehiredBooking": true
  
    }
  
  }, {
    "id": 4,
    "name": "Driver",
    "type": "Driver",
    "permission": {
      "dashboard": true,
      "subadmins": true,
      "hotel": true,
      "booking": true,
      "sightseeing": true,
      "privatevehicle": true,
      "deals": true,
      "hotelBooking": true,
      "sightBooking": true,
      "restaurantBooking": true,
      "privatehiredBooking": true
  
    }
  
  }, {
    "id": 5,
    "name": "HotelOpreator",
    "type": "HotelOpreator",
    "permission": {
      "dashboard": true,
      "subadmins": true,
      "hotel": true,
      "booking": true,
      "sightseeing": true,
      "privatevehicle": true,
      "deals": true,
      "hotelBooking": true,
      "sightBooking": true,
      "restaurantBooking": true,
      "privatehiredBooking": true
  
    }
  
  }, {
    "id": 6,
    "name": "PrivateHiredOpreator",
    "type": "PrivateHiredOpreator",
    "permission": {
      "dashboard": true,
      "subadmins": true,
      "hotel": true,
      "booking": true,
      "sightseeing": true,
      "privatevehicle": true,
      "deals": true,
      "hotelBooking": true,
      "sightBooking": true,
      "restaurantBooking": true,
      "privatehiredBooking": true
  
    }
  
  }, {
    "id": 7,
    "name": "SightSeeingOpreator",
    "type": "SightSeeingOpreator",
    "permission": {
      "dashboard": true,
      "subadmins": true,
      "hotel": true,
      "booking": true,
      "sightseeing": true,
      "privatevehicle": true,
      "deals": true,
      "hotelBooking": true,
      "sightBooking": true,
      "restaurantBooking": true,
      "privatehiredBooking": true
  
    }
  
  }];
  
    this.subscriptions[0] = this.subadminService.permissions$.subscribe(
      (data) => {
        if (data) {
          this.permissions = data
        }else{
          /*
          this.permissions = {
            dashboard : true,
            subadmins : true,
            hotel : true,
            booking : true,
            sightseeing : true,
            privatevehicle : true,
            deals : true ,
            hotelBooking : true ,
            sightBooking : true ,
            restaurantBooking : true, 
            privatehiredBooking : true, 

          }
          */
        }
      })
   }

  ngOnInit(): void {
    this.permissions = {
      dashboard : true,
      subadmins : true,
      hotel : true,
      booking : true,
      sightseeing : true,
      privatevehicle : true,
      deals : true,
      hotelBooking : true ,
      sightBooking : true ,
      restaurantBooking : true, 
      privatehiredBooking : true, 

    }
    this.subscriptions[2] =  this.signinService.roles$.subscribe(resp=>{
      if(resp){
        this.permissions = resp.permission;
          console.log("this.permissions",this.permissions);
            console.log("this.router.url",this.router.url);
            if(!this.permissions.subadmins && this.router.url == '/employees'){
              return this.router.navigate(['/']);
            }
            if(!this.permissions.hotel && this.router.url == '/hotel'){
              return this.router.navigate(['/']);
            }
            if(!this.permissions.sightseeing && this.router.url == '/sightseeing'){
              return this.router.navigate(['/']);
            }
            if(!this.permissions.privatevehicle && this.router.url == '/private-vehicle'){
              return this.router.navigate(['/']);
            }
            if(!this.permissions.deals && this.router.url == '/deals'){
              return this.router.navigate(['/']);
            }
            if(!this.permissions.hotelBooking && this.router.url == '/hotel-booking'){
              return this.router.navigate(['/']);
            }
            if(!this.permissions.sightBooking && this.router.url == '/sight-booking'){
              return this.router.navigate(['/']);
            }
            if(!this.permissions.privatehiredBooking && this.router.url == '/privatehired-booking'){
              return this.router.navigate(['/']);
            }
            if(!this.permissions.restaurantBooking && this.router.url == '/restaurant-booking'){
              return this.router.navigate(['/']);
            }
            if(!this.permissions.customers && this.router.url == '/customers'){
              return this.router.navigate(['/']);
            }

                
                

          


      }
    });

  }
  
  openHotelMenu(i){
    if($('.pcoded-hasali-'+i).hasClass('run')){
    $('.pcoded-hasali-'+i).removeClass('run');
    $('.pcoded-hasali-'+i).css('display','block');
    $('.angle-change-'+i).removeClass('ti-angle-right');
    $('.angle-change-'+i).addClass('ti-angle-down');


    }else{
    $('.pcoded-hasali-'+i).addClass('run');
    $('.pcoded-hasali-'+i).css('display','none');
    $('.angle-change-'+i).removeClass('ti-angle-down');

    $('.angle-change-'+i).addClass('ti-angle-right');
    }
  }

}
