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
export class CategoryService {
  categoryData$: BehaviorSubject<any> = new BehaviorSubject({});
  dealsData$: BehaviorSubject<any> = new BehaviorSubject({});
  customerData$: BehaviorSubject<any> = new BehaviorSubject({});
  walletData$: BehaviorSubject<any> = new BehaviorSubject({});

  url = `${environment.baseUrl}${environment.apiVersion}category`;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private notifyService: NotificationService,
    private spinner: NgxSpinnerService

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

  createCategory(formData){
    return  this.httpClient.post(this.url, formData,this.getHeadersWithForm());
  }

  editCategory(formData, id){
    return  this.httpClient.put(`${this.url}/edit/${id}`, formData,this.getHeadersWithForm());
  }
  createSightseeing(obj) {
    let url = `${environment.baseUrl}${environment.apiVersion}sightseeings`;
    return this.httpClient.post(url, obj, this.getHeaders());
  }
  editSightseeing(obj) {
    let url = `${environment.baseUrl}${environment.apiVersion}sightseeings`;
    return this.httpClient.patch(url, obj, this.getHeaders());
  }

  getAllSightseeing(p,filter) {    
    let url = `${environment.baseUrl}${environment.apiVersion}sightseeings?page=${p}`;
    if(filter != ""){
       url = `${environment.baseUrl}${environment.apiVersion}sightseeings/search?page=0&size=15&sort=dateCreated&name:like=${filter}||city:like=${filter}||town:like=${filter}`;

    }

    this.spinner.show();
    
    return this.httpClient.get(url, this.getHeaders()).subscribe(
      (res) => {
        if (res['content']) {
          this.spinner.hide();

          this.categoryData$.next(res);
        } 
      },
      (err) => {
        this.spinner.hide();

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
  getAllDeals(p,filter) {    
    let url = `${environment.baseUrl}${environment.apiVersion}deals?page=${p}`;
    if(filter != ""){
      url = `${environment.baseUrl}${environment.apiVersion}deals/search?page=0&size=15&sort=dateCreated,desc&name:like=${filter}`;
    }
    this.spinner.show();
      
    return this.httpClient.get(url, this.getHeaders()).subscribe(
      (res) => {
        if (res['content']) {
          this.spinner.hide();

          this.dealsData$.next(res);
        } 
      },
      (err) => {
        this.spinner.hide();

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

  deleteCategory(id){
    let url = `${environment.baseUrl}${environment.apiVersion}sightseeings/${id}`;

    return this.httpClient.delete(`${url}`, this.getHeaders())
  }

  getAllCustomer(p,filter) {    
    let url = `${environment.baseUrl}${environment.apiVersion}customers?page=${p}`;
    if(filter != ""){
        url = `${environment.baseUrl}${environment.apiVersion}customers/search?page=0&size=15&sort=dateCreated,desc&name:like=${filter}`;

    }
     this.spinner.show();
    return this.httpClient.get(url, this.getHeaders()).subscribe(
      (res) => {
        if (res['content']) {
          this.spinner.hide();
          this.customerData$.next(res);
        } 
      },
      (err) => {
        this.spinner.hide();
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


  getWallet(p) {    
    let url = `${environment.baseUrl}${environment.apiVersion}wallet/${p}`;
      
    return this.httpClient.get(url, this.getHeaders());
  }
    
  saveWallet(id,v){
    let url = `${environment.baseUrl}${environment.apiVersion}wallet/${id}`;

    return this.httpClient.patch(`${url}`,v, this.getHeaders())
  }
 
}

