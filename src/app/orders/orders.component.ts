import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { OrderService } from '../core/services/order-service/order.service';
import { NotificationService } from '../core/services/notification-service/notification.service';
import * as $ from 'jquery';
declare var $: any;
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css', '../subadmin-detail/subadmin-detail.component.css']
})
export class OrdersComponent implements OnInit {

  @ViewChild('myTable') table: DatatableComponent;
  subscriptions: Subscription[] = []
  rows: any = []
  temp = [];
  deleteId: String = ""
  items: any = []

  constructor(private orderService: OrderService, private notifyService: NotificationService) { 
    this.orderService.getAllOrders()
    this.subscriptions[0] = this.orderService.orderData$.subscribe(data => {
      if (data && data.length > 0) {
        console.log(data)
        this.rows = data;
        this.temp = [...data]
      }
    });
  }

  ngOnInit() {}
  
  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return (d.restaurantId.name.toLowerCase().indexOf(val) !== -1 || !val);
      //|| d.firstName.toLowerCase().indexOf(val) !== -1 || d.lastName.toLowerCase().indexOf(val) !== -1
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
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

  orderItems(id){
    const data =  this.rows.find(row => row._id === id);
    console.log(data.orderDetails)
    this.items = data.orderDetails
  }
 
  ngOnDestroy(){
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe()
    })
    this.orderService.orderData$.next(null)
  }

}
