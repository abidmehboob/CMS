import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from '../notification-service/notification.service';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EventService {

  eventData$: BehaviorSubject<any> = new BehaviorSubject([]);
  url = `${environment.baseUrl}${environment.apiVersion}event`;

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
  
  getHeadersWithForm() {
    const httpOptions = {
      headers: new HttpHeaders({
        'x-access-token': localStorage.getItem('token') ? localStorage.getItem('token') : undefined
      })
    };
    return httpOptions;
  }

  createEvent(obj) {
    return this.httpClient.post(this.url, obj, this.getHeadersWithForm());
  }

  editEvent(obj, id) {
    return this.httpClient.put(`${this.url}/edit/${id}`, obj, this.getHeadersWithForm());
  }

  getAllEvents() {
    return this.httpClient.get(this.url, this.getHeadersWithForm()).subscribe(
      (res) => {
        if (res['success']) {
          console.log(res)
          this.eventData$.next(res['data']);
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
    return this.httpClient.put(`${this.url}/status/${id}`, status, this.getHeadersWithForm()).subscribe(
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

  deleteEvent(id) {
    return this.httpClient.put(`${this.url}/delete/${id}`, {}, this.getHeadersWithForm())
  }
}
