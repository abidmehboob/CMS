import { FormsModule } from '@angular/forms';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../notification-service/notification.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SuperuserService {

  superuser$: BehaviorSubject<any> = new BehaviorSubject([]);
  url = `${environment.baseUrl}${environment.apiVersion}backstage/superuser/`;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private notifyService: NotificationService
  ) {}

  getHeaders() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') ? localStorage.getItem('token') : undefined}`
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

  getSuperuser(){
    return this.httpClient.get(this.url, this.getHeaders()).subscribe(
      (res) => {
        if (res['success']) {
          this.superuser$.next(res['data']);
          console.log(this.superuser$.getValue())
        } else {
          this.notifyService.showWarning('Something went wrong', 'Error');
        }
      },
      (err) => {
        const errObj = err.error.error;
        this.notifyService.showWarning(errObj, 'Error');
      }
    )
  }

  editSuperuser(formData){
    return  this.httpClient.put(`${this.url}edit`, formData,this.getHeadersWithForm());
  }

  editPass(obj){
    return this.httpClient.put(`${this.url}edit/password`, obj , this.getHeaders());
  }
}
