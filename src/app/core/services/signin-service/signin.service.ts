import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject ,of} from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../notification-service/notification.service'
import { environment } from './../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SigninService {

  user$: BehaviorSubject<any> = new BehaviorSubject(undefined);
  token: string = this.getToken();
  roles$: BehaviorSubject<any> = new BehaviorSubject(undefined);

  constructor(private httpClient: HttpClient, private router : Router, private notifyService : NotificationService) {
  }

  getHeaders() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'x-access-token' : localStorage.getItem('token') ? localStorage.getItem('token') : undefined
        })
      };
      return httpOptions;
    } 

  getToken() {
    return localStorage.getItem('token') ? localStorage.getItem('token') : undefined;
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  getRoles(id,type){
let permissionData =  [{
    "id": 1,
    "name": "SuperAdmin",
    "type": "SuperAdmin",
    "key" : "9tFMiX",
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
      "privatehiredBooking": true,
      "customers" : true,
      "allhotel" : true
  
    }
  }, {
    "id": 2,
    "name": "Admin",
    "key" : "061BtO",
    "type": "Admin",
    "permission": {
      "dashboard": true,
      "subadmins": true,
      "hotel": false,
      "booking": false,
      "sightseeing": false,
      "privatevehicle": false,
      "deals": false,
      "hotelBooking": false,
      "sightBooking": false,
      "restaurantBooking": false,
      "privatehiredBooking": false,
      "allhotel" : false
  
    }
  
  }, {
    "id": 3,
    "name": "HotelManager",
    "type": "HotelManager",
    "key" : "UlQQSs",
    "permission": {
      "dashboard": true,
      "subadmins": false,
      "hotel": true,
      "booking": true,
      "sightseeing": false,
      "privatevehicle": false,
      "deals": false,
      "hotelBooking": true,
      "sightBooking": false,
      "restaurantBooking": true,
      "privatehiredBooking": false,
      "allhotel" : true
  
    }
  
  }, {
    "id": 4,
    "name": "Driver",
    "type": "Driver",
    "key" : "J2Bwxb",
    "permission": {
      "dashboard": true,
      "subadmins": false,
      "hotel": false,
      "booking": false,
      "sightseeing": false,
      "privatevehicle": true,
      "deals": false,
      "hotelBooking": false,
      "sightBooking": false,
      "restaurantBooking": false,
      "privatehiredBooking": true,
      "allhotel" : false
  
    }
  
  }, {
    "id": 5,
    "name": "HotelOpreator",
    "type": "HotelOpreator",
    "key" : "iDKwZJ",
    "permission": {
      "dashboard": true,  
      "subadmins": false,
      "hotel": true,
      "booking": false,
      "sightseeing": false,
      "privatevehicle": false,
      "deals": false,
      "hotelBooking": true,
      "sightBooking": false,
      "restaurantBooking": true,
      "privatehiredBooking": false,
      "allhotel" : true
  
    }
  
  }, {
    "id": 6,
    "name": "PrivateHiredOpreator",
    "type": "PrivateHiredOpreator",
    "key" : "pxuklk",
    "permission": {
      "dashboard": true,
      "subadmins": false,
      "hotel": false,
      "booking": false,
      "sightseeing": false,
      "privatevehicle": true,
      "deals": false,
      "hotelBooking": false,
      "sightBooking": false,
      "restaurantBooking": false,
      "privatehiredBooking": true,
      "allhotel" : false
  
    }
  
  }, {
    "id": 7,
    "name": "SightSeeingOpreator",
    "type": "SightSeeingOpreator",
    "key" : "WYQrDZ",
    "permission": {
      "dashboard": true,
      "subadmins": false,
      "hotel": false,
      "booking": false,
      "sightseeing": true,
      "privatevehicle": false,
      "deals": false,
      "hotelBooking": false,
      "sightBooking": true,
      "restaurantBooking": false,
      "privatehiredBooking": false,
      "allhotel" : false
  
    }
  
  }
  , {
    "id": 8,
    "name": "DealOpreator",
    "type": "DealOpreator",
    "key" : "WYQrop",
    "permission": {
      "dashboard": true,
      "subadmins": false,
      "hotel": false,
      "booking": false,
      "sightseeing": false,
      "privatevehicle": false,
      "deals": true,
      "hotelBooking": false,
      "sightBooking": false,
      "restaurantBooking": false,
      "privatehiredBooking": false,
      "allhotel" : false
  
    }
  
  }
];


      permissionData.forEach(r=>{
        if(type == 0){
          if(r.id == id){
            localStorage.setItem('np', r.key);

            this.roles$.next(r);
  
          }
  
        }else{
          if(r.key == id){
          
            this.roles$.next(r);
  
          }
          
        }
        
      })
  }

  checkSession(){
    const user = this.user$.getValue();
    if (user) {
      return true;
    }
    else if (this.getToken()) {
     // this.tokenValidateFromServer();
     let key =  localStorage.getItem('np');
     if(key != undefined){
          this.getRoles(key,1);

       }
      return true;
    }
    else{
      return false;
    }

  }
  
  tokenValidateFromServer(){
    let url = `${environment.baseUrl}${environment.apiVersion}backstage/admin/validate`;
    return this.httpClient.get(url,this.getHeaders()).subscribe((res) => {
      if (res['success']) {
        console.log(res);
        this.user$.next(res['data']);
      } else {
       this.logout();
       console.log('me here 0')
      }

    }
    , err => {
      this.notifyService.showWarning("Error","Please login again");
     this.logout();
     console.log('me here 1')
    });
  }

  signin(user: Object) {
    let url = `${environment.baseUrl}${environment.apiVersion}employees/auth/login`;
    this.httpClient.post(`${url}`, user)
      .subscribe(res => {
        if (res) {
          localStorage.removeItem('foo'); 

          this.setToken(res['access_token']);
          this.getRoles(res['roles']['roleId'],0);
          localStorage.setItem('ih',res['hotel_id']);
          localStorage.setItem('mg',res['hotel_image']);

          

          this.user$.next(res);
          return this.router.navigate(['/dashboard']);

        } else {
          this.notifyService.showWarning("Something went wrong", "Error");

          // this.toaster.showError(res['error']);
          //this.error$.next(res['error']);
        }
      }, err => {
        const errObj = err.error.error_description;
        this.notifyService.showWarning(errObj, "Error");

        //this.error$.next(errObj.error);
      });
  }  

  logout() {
    localStorage.removeItem('token');
    this.user$.next(undefined);
    this.router.navigate(['/']);
  }
  
  isLoggedIn(state) {
    const user = this.user$.getValue();
    if (user) {
      
      if (state.url !== '/'  ) {
        return of(true);
      } else {
        /*
        if (user['user_tc_accepted'] == '0') {
          this.router.navigate(['/terms']);
        } else if (user['user_help_completed'] != '1') {
          this.router.navigate(['/signup-details']);
        } else {
          this.router.navigate(['/dashboard']);
        }
        */
        this.router.navigate(['/dashboard']);
      }
    } else if (this.getToken()) {
      if (state.url === '/') {
        this.router.navigate(['/dashboard']);
      } else {
        return of(true);

      }
    } else if (state.url === '/') {
      return of(true);
    } else {
      this.router.navigate(['/']);
    }
  }  

}
