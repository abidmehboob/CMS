import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../notification-service/notification.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {

  restaurantData$: BehaviorSubject<any> = new BehaviorSubject([]);
  menus$: BehaviorSubject<any> = new BehaviorSubject([]);
  orders$:  BehaviorSubject<any> = new BehaviorSubject([]);
  restaurant$: BehaviorSubject<any> = new BehaviorSubject(null);
  
  url = `${environment.baseUrl}${environment.apiVersion}backstage/restaurant`;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private notifyService: NotificationService
  ) {}

  getHeaders() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'x-access-token' : localStorage.getItem('token') ? localStorage.getItem('token') : undefined
        })
      };
      return httpOptions;
    }

  getHeadersWithForm() {
    const httpOptions = {
      headers: new HttpHeaders({
        'x-access-token' : localStorage.getItem('token') ? localStorage.getItem('token') : undefined
        })
      };
      return httpOptions;
  }
  
  getAllRestaurants() {
    //console.log('ur;')
    return this.httpClient.get(this.url, this.getHeaders()).subscribe(
      (res) => {
        if (res['success']) {
          this.restaurantData$.next(res['data']);
          console.log(res['data'])
        } 
      },
      (err) => {
        const errObj = err.error.error;
        if(errObj.includes('No data found')){
          console.log(errObj)
        }
        else{
          this.notifyService.showWarning(errObj, 'Error');
        }
      }
    );
  }
  
  editRestaurant(formData, id){
    return  this.httpClient.put(`${this.url}/edit/${id}`, formData,this.getHeadersWithForm());
  }

  changeStatus(id, status){
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

  deliveryStatus(id, status){
    return this.httpClient.put(`${this.url}/delivery_status/${id}`, status, this.getHeaders()).subscribe(
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
  
  deleteRestaurant(id){
    return this.httpClient.put(`${this.url}/delete/${id}`, {}, this.getHeaders())
  }
  
  getRestaurantAllMenus(id) {
    //console.log('ur;')
    return this.httpClient.get(`${this.url}/all_menus/${id}`, this.getHeaders()).subscribe(
      (res) => {
        console.log(res)
        if (res['success']) {
          this.menus$.next(res['data']);
        } 
      },
      (err) => {
        const errObj = err.error.error;
        if(errObj.includes('No data found')){
          console.log(errObj)
        }
        else{
          this.notifyService.showWarning(errObj, 'Error');
        }
      }
    );
  }
  
  getRestaurantAllOrders(id) {
    //console.log('ur;')
    return this.httpClient.get(`${this.url}/all_orders/${id}`, this.getHeaders()).subscribe(
      (res) => {
        console.log(res)
        if (res['success']) {
          this.orders$.next(res['data']['orders']);
          this.restaurant$.next(res['data']['restaurant'])
        } 
      },
      (err) => {
        const errObj = err.error.error;
        if(errObj.includes('No data found')){
          console.log(errObj)
        }
        else{
          this.notifyService.showWarning(errObj, 'Error');
        }
      }
    );
  }
}
