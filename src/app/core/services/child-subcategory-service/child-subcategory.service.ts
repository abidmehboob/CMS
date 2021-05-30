import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../notification-service/notification.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChildSubcategoryService {

  childSubcategoryData$: BehaviorSubject<any> = new BehaviorSubject([]);
  url = `${environment.baseUrl}${environment.apiVersion}child-subcategory`;

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

  createChildSubcategory(formData){
    return  this.httpClient.post(this.url, formData,this.getHeadersWithForm());
  }

  editChildSubcategory(formData, id){
    return  this.httpClient.put(`${this.url}/edit/${id}`, formData,this.getHeadersWithForm());
  }

  getAllChildSubcategories() {    
    //console.log('ur;')
    return this.httpClient.get(this.url, this.getHeaders()).subscribe(
      (res) => {
        if (res['success']) {
          this.childSubcategoryData$.next(res['data']);
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

  deleteChildSubcategory(id){
    return this.httpClient.put(`${this.url}/delete/${id}`, {}, this.getHeaders())
  }
}
