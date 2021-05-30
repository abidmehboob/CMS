import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from '../notification-service/notification.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocialLinkService {

  
  socialLinkData$: BehaviorSubject<any> = new BehaviorSubject([]);
  url = `${environment.baseUrl}${environment.apiVersion}social-link`;

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

  editSocialLink(obj, id) {
    return this.httpClient.put(`${this.url}/edit/${id}`, obj, this.getHeaders());
  }

  getAllSocialLinks() {
    return this.httpClient.get(this.url, this.getHeaders()).subscribe(
      (res) => {
        if (res['success']) {
          console.log(res)
          this.socialLinkData$.next(res['data']);
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
