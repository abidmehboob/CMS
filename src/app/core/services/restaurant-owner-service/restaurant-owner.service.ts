import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../notification-service/notification.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestaurantOwnerService {

  resOwnerData$: BehaviorSubject<any> = new BehaviorSubject([]);
  url = `${environment.baseUrl}${environment.apiVersion}backstage/restaurant_owner`;

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

  getAllRestaurantOwners() {
    //console.log('ur;')
    return this.httpClient.get(this.url, this.getHeaders()).subscribe(
      (res) => {
        if (res['success']) {
          this.resOwnerData$.next(res['data']);
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
  
  editRestaurantOwner(formData, id){
    return  this.httpClient.put(`${this.url}/edit/${id}`, formData,this.getHeadersWithForm());
  }

  changeStatus(id, status){
    return this.httpClient.put(`${this.url}/status/${id}`, status, this.getHeaders()).subscribe(
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

  deleteRestaurantOwner(id){
    return this.httpClient.put(`${this.url}/delete/${id}`, {}, this.getHeaders())
  }
}
