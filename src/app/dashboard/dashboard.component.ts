import { DashboardService } from './../core/services/dashboard-service/dashboard.service';
import { Component, OnInit } from '@angular/core';
import { environment } from './../../environments/environment';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalCustomers: Number
  totalListings: number
  totalSubscriptions: number
  totalEvents: number
  registrationsToday: number
  listingsToday: number
  totalSignups: number
  imgBase = ""
  bgImg = "";

  constructor(private dashboardService: DashboardService) {
    this.imgBase = environment.imageBase+"file_uploads/hotel_images/";
    /*
    this.dashboardService.totalCustomers()
    .subscribe(res => this.totalCustomers = res['data'])

    this.dashboardService.totalListings()
    .subscribe(res => this.totalListings = res['data'])

    this.dashboardService.totalSubscriptions()
    .subscribe(res => this.totalSubscriptions = res['data'])

    this.dashboardService.totalEvents()
    .subscribe(res => this.totalEvents = res['data'])

    this.dashboardService.registrationsToday()
    .subscribe(res => this.registrationsToday = res['data'])
    
    this.dashboardService.listingsToday()
    .subscribe(res => this.listingsToday = res['data'])
    
    this.dashboardService.totalSignups()
    .subscribe(res => this.totalSignups = res['data'])
    */
    this.bgImg = localStorage.getItem('mg') ? localStorage.getItem('mg') : "";
    
  }

  ngOnInit(): void {
    if (!localStorage.getItem('foo')) { 
      localStorage.setItem('foo', 'no reload') 
      location.reload() 
    } else {
      localStorage.removeItem('foo') 
    }   
  }

}
