import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../notification-service/notification.service';
import { environment } from '../../../../environments/environment';
import { Customer } from 'src/app/shared/models/customer.model';


@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  customerData$: BehaviorSubject<any> = new BehaviorSubject([]);
  countryData$: BehaviorSubject<any> = new BehaviorSubject([]);
  customer$: BehaviorSubject<any> = new BehaviorSubject(null);
  orders$: BehaviorSubject<any> = new BehaviorSubject([])
  //status$: BehaviorSubject<any> = new BehaviorSubject([]);
  url = `${environment.baseUrl}${environment.apiVersion}customer`;

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

  getAllCustomers() {    
    //console.log('ur;')
    return this.httpClient.get(`${this.url}/all`, this.getHeaders()).subscribe(
      (res) => {
        console.log(res)
        if (res['success']) {
          this.customerData$.next(res['data']);
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

  editCustomer(formData, id){
    return  this.httpClient.put(`${this.url}/edit/${id}`, formData,this.getHeadersWithForm());
  }

  deleteCustomer(id){
    return this.httpClient.put(`${this.url}/delete/${id}`, {}, this.getHeaders())
  }
  
  getSingleCustomer(id){
    return this.httpClient.get(`${this.url}/${id}`, this.getHeaders())
  }
  getAllCountries() {
    return this.httpClient
      .get(`${environment.baseUrl}${environment.apiVersion}country/`)
      .subscribe((res) => {
        if (res['success']) {
          this.countryData$.next(res['data']);
        }
      });
  }
  getStates(countryId) {
    return this.httpClient.get(`${environment.baseUrl}${environment.apiVersion}state/${countryId}`);
  }

  getCities(stateId) {
    return this.httpClient.get(`${environment.baseUrl}${environment.apiVersion}city/${stateId}`);
  }
}