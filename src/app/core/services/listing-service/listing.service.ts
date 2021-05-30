import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../notification-service/notification.service';
import { environment } from '../../../../environments/environment';
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
  providedIn: 'root'
})
export class ListingService {

  listingData$: BehaviorSubject<any> = new BehaviorSubject({});
  hotelBookingData$: BehaviorSubject<any> = new BehaviorSubject([]);
  sightBookingData$: BehaviorSubject<any> = new BehaviorSubject([]);
  restaurantBookingData$: BehaviorSubject<any> = new BehaviorSubject([]);
  privatehiredBookingData$: BehaviorSubject<any> = new BehaviorSubject([]);
  dealBookingData$: BehaviorSubject<any> = new BehaviorSubject([]);
  bookingData$: BehaviorSubject<any> = new BehaviorSubject([]);


  url = `${environment.baseUrl}${environment.apiVersion}listing`;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private notifyService: NotificationService,
    private spinner: NgxSpinnerService
  ) { }
  getHeadersWithForm() {
    const httpOptions = {
      headers: new HttpHeaders({
        'x-access-token' : localStorage.getItem('token') ? localStorage.getItem('token') : undefined,
        'Authorization': `Bearer ${localStorage.getItem('token') ? localStorage.getItem('token') : undefined}`

        })
      };
      return httpOptions;
    }

  getHeaders() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token') ? localStorage.getItem('token') : undefined}`
      })
  
    };
    return httpOptions;
  }
  uploadFile(formData: FormData) {
    let url = `${environment.baseUrl}${environment.apiVersion}attachments`;

    return this.httpClient.post(
      `${url}`,
      formData,this.getHeadersWithForm()
    );
  }

  createHotel(obj) {
    let url = `${environment.baseUrl}${environment.apiVersion}hotels`;
    return this.httpClient.post(url, obj, this.getHeaders());
  }
 
  createHotelMenu(obj) {
    let url = `${environment.baseUrl}${environment.apiVersion}menus`;
    return this.httpClient.post(url, obj, this.getHeaders());
  }
 
  editHotel(obj) {
    let url = `${environment.baseUrl}${environment.apiVersion}hotels`;
    return this.httpClient.patch(url, obj, this.getHeaders());
  }

  createDeals(obj) {
    let url = `${environment.baseUrl}${environment.apiVersion}deals`;

    return this.httpClient.post(url, obj, this.getHeaders());
  }
  editDeals(obj) {
    let url = `${environment.baseUrl}${environment.apiVersion}deals`;

    return this.httpClient.patch(url, obj, this.getHeaders());
  }

  getAllHotel(p,filter) {
    this.spinner.show();
    let url = `${environment.baseUrl}${environment.apiVersion}hotels?page=${p}`;

    if(filter != ""){

    //  url = `${environment.baseUrl}${environment.apiVersion}hotels/search?page=0&size=15&sort=dateCreated,desc&name:like=${filter}&description:like=${filter}&email:like=${filter}&phone:like=${filter}&accountNumber:like=${filter}`;
      url = `${environment.baseUrl}${environment.apiVersion}hotels/search?page=0&size=15&sort=dateCreated,desc&name:like=${filter}`;

    }
    return this.httpClient.get(`${url}`,this.getHeaders()).subscribe(
      (res) => {
        if (res['content']) {
          this.listingData$.next(res);
          this.spinner.hide();
        }
      },
      (err) => {
        const errObj = err.error.error;
        if (errObj.includes('No data found')) {
        }
        else {
          this.notifyService.showWarning(errObj, 'Error');
        }
      }
    );
  }

  getAllPrivatehiredBooking() {
    let url = `${environment.baseUrl}${environment.apiVersion}privatevehicles/booking`;

    return this.httpClient.get(`${url}`,this.getHeaders()).subscribe(
      (res) => {
        if (res['content']) {
          this.privatehiredBookingData$.next(res['content']);
        }
      },
      (err) => {
        const errObj = err.error.error;
        if (errObj.includes('No data found')) {
          console.log(errObj)
        }
        else {
          this.notifyService.showWarning(errObj, 'Error');
        }
      }
    );
  }
  getAllRestaurantBooking() {
    let url = `${environment.baseUrl}${environment.apiVersion}hotel/booking?hotel.businessType=Restaurant`;

    return this.httpClient.get(`${url}`,this.getHeaders()).subscribe(
      (res) => {
        if (res['content']) {
          this.restaurantBookingData$.next(res['content']);
        }
      },
      (err) => {
        const errObj = err.error.error;
        if (errObj.includes('No data found')) {
          console.log(errObj)
        }
        else {
          this.notifyService.showWarning(errObj, 'Error');
        }
      }
    );
  }

  
  getAllSightseeingBooking() {
    let url = `${environment.baseUrl}${environment.apiVersion}sightseeings/booking`;

    return this.httpClient.get(`${url}`,this.getHeaders()).subscribe(
      (res) => {
        if (res['content']) {
          this.sightBookingData$.next(res['content']);
        }
      },
      (err) => {
        const errObj = err.error.error;
        if (errObj.includes('No data found')) {
          console.log(errObj)
        }
        else {
          this.notifyService.showWarning(errObj, 'Error');
        }
      }
    );
  }

  getAllHotelBooking() {
    let url = `${environment.baseUrl}${environment.apiVersion}hotel/booking?hotel.businessType=Hotel`;

    return this.httpClient.get(`${url}`,this.getHeaders()).subscribe(
      (res) => {
        if (res['content']) {
          this.hotelBookingData$.next(res['content']);
        }
      },
      (err) => {
        const errObj = err.error.error;
        if (errObj.includes('No data found')) {
          console.log(errObj)
        }
        else {
          this.notifyService.showWarning(errObj, 'Error');
        }
      }
    );
  }


  getCustomerListing(id) {
    //console.log('ur;')
    return this.httpClient.get(`${this.url}/customer/${id}`, this.getHeaders()).subscribe(
      (res) => {
        if (res['success']) {
          this.listingData$.next(res['data']);
        }
      },
      (err) => {
        const errObj = err.error.error;
        if (errObj.includes('No data found')) {
          console.log(errObj)
        }
        else {
          this.notifyService.showWarning(errObj, 'Error');
        }
      }
    );
  }
  changeStatus(id, status) {
    return this.httpClient.put(`${this.url}/status/${id}`, status, this.getHeaders()).subscribe(
      (res) => {
        if (res['success']) {
          console.log(res)
          // this.status$.next(res['data']);
        } else {
          this.notifyService.showWarning('Something went wrong', 'Error');
        }
      },
      (err) => {
        const errObj = err.error.error;
        this.notifyService.showWarning(errObj, 'Error');
      }
    );
  }
  
  featuredListing(obj, id) {
    return this.httpClient.put(`${this.url}/featured/${id}`, obj, this.getHeaders()).subscribe(
      (res) => {
        if (res['success']) {
          console.log(res)
        } else {
          this.notifyService.showWarning('Something went wrong', 'Error');
        }
      },
      (err) => {
        const errObj = err.error.error;
        this.notifyService.showWarning(errObj, 'Error');
      }
    );
  }

  deleteListing(id) {
    let url = `${environment.baseUrl}${environment.apiVersion}hotels/${id}`;

    return this.httpClient.delete(`${url}`, this.getHeaders())
  }

  deleteMenu(id) {
    let url = `${environment.baseUrl}${environment.apiVersion}menus/${id}`;

    return this.httpClient.delete(`${url}`, this.getHeaders())
  }
  getAllDealBooking() {
    let url = `${environment.baseUrl}${environment.apiVersion}deal/bookings`;

    return this.httpClient.get(`${url}`,this.getHeaders()).subscribe(
      (res) => {
        if (res['content']) {
          this.dealBookingData$.next(res['content']);
        }
      },
      (err) => {
        const errObj = err.error.error;
        if (errObj.includes('No data found')) {
          console.log(errObj)
        }
        else {
          this.notifyService.showWarning(errObj, 'Error');
        }
      }
    );
  }

  getAllBooking() {
    let url = `${environment.baseUrl}${environment.apiVersion}bookings`;

    return this.httpClient.get(`${url}`,this.getHeaders()).subscribe(
      (res) => {
        if (res['content']) {
          this.bookingData$.next(res['content']);
        }
      },
      (err) => {
        const errObj = err.error.error;
        if (errObj.includes('No data found')) {
          console.log(errObj)
        }
        else {
          this.notifyService.showWarning(errObj, 'Error');
        }
      }
    );
  }

  statusUpdate(modules,obj) {
    let url = `${environment.baseUrl}${environment.apiVersion}${modules}`;
    return this.httpClient.patch(url, obj, this.getHeaders());
  }

}
