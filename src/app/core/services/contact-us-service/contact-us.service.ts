import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../notification-service/notification.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {
  contactUsData$: BehaviorSubject<any> = new BehaviorSubject([]);
  url = `${environment.baseUrl}${environment.apiVersion}contactus`;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
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

  getAll() {
    //console.log('ur;')
    return this.httpClient.get(this.url, this.getHeaders()).subscribe(
      (res) => {
        if (res['success']) {
          this.contactUsData$.next(res['data']);
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

}
