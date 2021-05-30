import { RestaurantService } from './../core/services/restaurant-service/restaurant.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService } from '../core/services/notification-service/notification.service';
import { OrderService } from '../core/services/order-service/order.service';
import * as $ from 'jquery';
declare var $: any;
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-restaurant-orders',
  templateUrl: './restaurant-orders.component.html',
  styleUrls: ['./restaurant-orders.component.css', '../subadmin-detail/subadmin-detail.component.css']
})
export class RestaurantOrdersComponent implements OnInit {
  
  @ViewChild('myTable') table: DatatableComponent;
  subscriptions: Subscription[] = []
  rows: any = []
  temp = [];
  restaurant: any = ""
  deleteId: String = ""
  items: any = []

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private restaurantService: RestaurantService,
    private orderService: OrderService,
    private notifyService: NotificationService) {
      this.subscriptions[0] = this.activatedRoute.paramMap.subscribe(params => { 
        const id = params.get('id'); 
        this.restaurantService.getRestaurantAllOrders(id)
        this.subscriptions[1] = this.restaurantService.orders$.subscribe(data => {
          if (data && data.length > 0) {
            this.rows = data;
            this.temp = [...data]
            console.log(this.rows)
          }
        });
        this.subscriptions[2] = this.restaurantService.restaurant$.subscribe(data => {
          if (data) {
            this.restaurant = data;
          }
        });
        console.log(this.restaurant)
     })
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return (d.customerId.firstName.toLowerCase().indexOf(val) !== -1 || !val);
      //|| d.firstName.toLowerCase().indexOf(val) !== -1 || d.lastName.toLowerCase().indexOf(val) !== -1
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }  

  orderItems(id){
    const data =  this.rows.find(row => row._id === id);
    this.items = data.orderDetails
  }
  
  deleteForm(id) {
    this.deleteId = id
  }

  modalClose(modalId) {
    $(`#${modalId}`).trigger('click');
  }
  
  changeStatus(id, e){
    let status = e.target.value
    const object = {
      status
    }
    this.orderService.changeStatus(id, object)
  }

  deleteOrder(){
    this.orderService.deleteOrder(this.deleteId)
    .subscribe((res) => {
      console.log(res)
      if (res['success']) {
        this.rows = this.rows.filter((order) => order['_id'] !== this.deleteId)
        this.notifyService.showSuccess('Successfully Deleted', 'Success')
        this.deleteId = null
      } else {
        this.notifyService.showWarning('Something went wrong', 'Error');
      }
    },
    (err) => {
      const errObj = err.error.error;
      this.notifyService.showWarning(errObj, 'Error');
    })
    this.modalClose('deleteModal') 
  }
  
  ngOnInit() {}

  ngOnDestroy(){
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe()
    })
    this.restaurantService.orders$.next(null)
    this.restaurantService.restaurant$.next(null)
  }

}
