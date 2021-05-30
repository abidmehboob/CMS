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
export class SubadminService {

  subadminData$: BehaviorSubject<any> = new BehaviorSubject({});
  roleData$: BehaviorSubject<any> = new BehaviorSubject([]);
  
  permissions$: BehaviorSubject<any> = new BehaviorSubject({});
  url = `${environment.baseUrl}${environment.apiVersion}backstage`;

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
    
  getAllSubadmins(p,filter) {
    //console.log('ur;')
    let url = `${environment.baseUrl}${environment.apiVersion}employees?page=${p}`;
    if(filter != ""){
         url = `${environment.baseUrl}${environment.apiVersion}employees/search?page=0&size=15&sort=dateCreated,desc&name:like=${filter}`;

    }
    this.spinner.show();

    return this.httpClient.get(url, this.getHeaders()).subscribe(
      (res) => {
        if (res['content']) {
          this.spinner.hide();
          this.subadminData$.next(res);
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

  getAllRoles() {
    //console.log('ur;')
    let url = `${environment.baseUrl}${environment.apiVersion}roles`;

    return this.httpClient.get(url, this.getHeaders()).subscribe(
      (res) => {
        if (res['content']) {
          this.roleData$.next(res['content']);
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
  createEmployee(obj) {
    let url = `${environment.baseUrl}${environment.apiVersion}employees/auth/register-employee`;
    return this.httpClient.post(url, obj, this.getHeaders());
  }
  editEmployee(obj,id) {
    let url = `${environment.baseUrl}${environment.apiVersion}employees/${id}`;
    return this.httpClient.put(url, obj, this.getHeaders());
  }

  createSubadmin(formData){
    return this.httpClient.post(this.url, formData, this.getHeadersWithForm())
  }
  
  editSubadmin(formData, id){
    return  this.httpClient.put(`${this.url}/edit/${id}`, formData,this.getHeadersWithForm());
  }

  changeStatus(id, status){
    return this.httpClient.put(`${this.url}/status/${id}`, status, this.getHeaders()).subscribe(
      (res) => {
        if (res['success']) {
          console.log(res)
         // this.status$.next(res['data']);
          /* */

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
  deleteSubadmin(id){
    return this.httpClient.put(`${this.url}/delete/${id}`, {}, this.getHeaders())
  }
  
  getSubadminPermissions(){
    return this.httpClient.get(`${this.url}/permissions`, this.getHeaders()).subscribe(
      (res) => {
        if (res['success']) {
          this.permissions$.next(res['data']);
          console.log(this.permissions$.getValue())
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
}
