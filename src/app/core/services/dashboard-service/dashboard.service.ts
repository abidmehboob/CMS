import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  url = `${environment.baseUrl}${environment.apiVersion}dashboard`;

  constructor(private httpClient: HttpClient) { }
  
  getHeaders() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'x-access-token' : localStorage.getItem('token') ? localStorage.getItem('token') : undefined
        })
      };
      return httpOptions;
    }

  totalCustomers(){
    return this.httpClient.get(`${this.url}/totalCustomers`, this.getHeaders())
  }

  totalListings(){
    return this.httpClient.get(`${this.url}/totalListings`, this.getHeaders())
  }
  
  totalSubscriptions(){
    return this.httpClient.get(`${this.url}/totalSubscriptions`, this.getHeaders())
  }

  // pendingSubscriptions(){
  //   return this.httpClient.get(`${this.url}/pendingSubscriptions?days=1`, this.getHeaders())
  // }
  
  totalEvents(){
    return this.httpClient.get(`${this.url}/totalEvents`, this.getHeaders())
  }

  registrationsToday(){
    return this.httpClient.get(`${this.url}/registrationsToday?days=1`, this.getHeaders())
  }

  listingsToday(){
    return this.httpClient.get(`${this.url}/listingsToday?days=1`, this.getHeaders())
  }

  totalSignups(){
    return this.httpClient.get(`${this.url}/totalSignups`, this.getHeaders())
  }
  
  }
