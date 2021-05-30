import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../notification-service/notification.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  subscriptionData$: BehaviorSubject<any> = new BehaviorSubject([]);
  url = `${environment.baseUrl}${environment.apiVersion}package`;

  constructor(
    private httpClient: HttpClient,
    private notifyService: NotificationService
  ) { }

  getHeaders() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token') ? localStorage.getItem('token') : undefined
      })
    };
    return httpOptions;
  }

  createSubscription(obj) {
    return this.httpClient.post(this.url, obj, this.getHeaders());
  }

  editSubscription(obj, id) {
    return this.httpClient.put(`${this.url}/edit/${id}`, obj, this.getHeaders());
  }

  getAllSubscriptions() {
    return this.httpClient.get(this.url, this.getHeaders()).subscribe(
      (res) => {
        if (res['success']) {
          console.log(res)
          this.subscriptionData$.next(res['data']);
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

  deleteSubscription(id) {
    return this.httpClient.put(`${this.url}/delete/${id}`, {}, this.getHeaders())
  }
}
