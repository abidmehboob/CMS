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
export class SubcategoryService {

  
  subcategoryData$: BehaviorSubject<any> = new BehaviorSubject({});
  url = `${environment.baseUrl}${environment.apiVersion}subcategory`;

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

  createSubcategory(formData){
    return  this.httpClient.post(this.url, formData,this.getHeadersWithForm());
  }
  createPrivateHire(obj) {
    let url = `${environment.baseUrl}${environment.apiVersion}privatevehicles`;

    return this.httpClient.post(url, obj, this.getHeaders());
  }

  editPrivateHire(obj) {
    let url = `${environment.baseUrl}${environment.apiVersion}privatevehicles`;

    return this.httpClient.patch(url, obj, this.getHeaders());
  }


  editSubcategory(formData, id){
    return  this.httpClient.put(`${this.url}/edit/${id}`, formData,this.getHeadersWithForm());
  }

  getAllPrivateVehicle(p,filter) {    
    let url = `${environment.baseUrl}${environment.apiVersion}privatevehicles?page=${p}`;
    if(filter != ""){
        url = `${environment.baseUrl}${environment.apiVersion}privatevehicles/search?page=0&size=15&sort=dateCreated,desc&name:like=${filter}`;

    }
    this.spinner.show();

    return this.httpClient.get(url, this.getHeaders()).subscribe(
      (res) => {
        if (res['content']) {
          this.spinner.hide();

          this.subcategoryData$.next(res);
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
  getSubcategoriesAgainstCategory(categoryId) {    
    //console.log('ur;')
    return this.httpClient.get(`${this.url}/admin/${categoryId}`, this.getHeaders()).subscribe(
      (res) => {
        if (res['success']) {
          this.subcategoryData$.next(res['data']);
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

  deleteSubcategory(id){
    let url = `${environment.baseUrl}${environment.apiVersion}privatevehicles/${id}`;
    return this.httpClient.delete(`${url}`, this.getHeaders())

  }
}
