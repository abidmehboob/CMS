import { Component, OnInit,ViewChild } from '@angular/core';
import { CustomerService } from '../core/services/customer-service/customer.service';
import { Customer } from '../shared/models/customer.model';
import { Subscription } from 'rxjs';
import { environment } from './../../environments/environment';
import { NotificationService } from '../core/services/notification-service/notification.service';
import * as $ from 'jquery';
declare var $: any;
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css','../subadmin-detail/subadmin-detail.component.css'],
  providers: [CustomerService]
})

export class CustomerDetailComponent implements OnInit {
  @ViewChild('myTable') table: DatatableComponent;

  rows: any = [];
  temp = [];

  subscriptions: Subscription[] = [];
  deleteId: String = ""
  editId: String = ""
  
  imageUrl: string = null;
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;

  firstNameE : string = null;
  lastNameE : string = null;
  emailE: string = null
  phoneNumberE: string = "";
  imageE: string = null;
  previewUrlE: any = null;
  
  constructor(private customerService: CustomerService, private notifyService: NotificationService) { 
    this.imageUrl = environment.imageBase;

    this.customerService.getAllCustomers()
    this.subscriptions[0] = this.customerService.customerData$.subscribe(data => {
      if (data && data.length > 0) {
        this.rows = data;
        this.temp = [...data];

        console.log('this.customers)',this.rows);
      }
    });
  }

  ngOnInit() {
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return ((d.email.toLowerCase().indexOf(val) !== -1 || d.firstName.toLowerCase().indexOf(val) !== -1 || d.lastName.toLowerCase().indexOf(val) !== -1 || !val));
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }  

  modalClose(modalId) {
    $(`#${modalId}`).trigger('click');
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }

  preview() {
    // Show preview
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrlE = reader.result;
    };
  }

  removeImg(){
    this.previewUrlE = null;
  }

  resetHighlight() {
    let elem = document.getElementsByClassName('form-control');
    //elem.style = "color:red; border: 1px solid red";
    $('.form-control').css('border', '');
  }

  showHighlight(e) {
    let elem: HTMLElement = document.getElementById(e);
    elem.setAttribute('style', 'border: 1px solid red;');
  }

  changeStatus(id, e){
    let status = e.target.checked ? "active" : "blocked"
    const object = {
      status
    }
    this.customerService.changeStatus(id, object)
  }

  editForm(id , i){
    console.log(id, i)
    const editData =  this.rows.find(row => row._id === id);

    console.log('editData',editData);
    this.firstNameE  = editData.firstName;
    this.lastNameE  = editData.lastName;
    this.emailE = editData.email;
    this.phoneNumberE = editData.phoneNumber;
    this.imageE = editData.profilePicture;
    this.editId = editData._id;
    this.previewUrlE = this.imageUrl+editData.profilePicture;
  }

  onSubmitEdit() {
    console.log('this.fileData',this.fileData);
  
    this.resetHighlight();
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.firstNameE === null) {
      this.notifyService.showWarning('First name required', 'Error');
      this.showHighlight('firstNameE');
      return false;
    }

    if (this.lastNameE === null) {
      this.notifyService.showWarning('Last name required', 'Error');
      this.showHighlight('lastNameE');
      return false;
    }
    if (this.emailE === null) {
      this.notifyService.showWarning('email required', 'Error');
      this.showHighlight('emailE');
      return false;
    }
    if (!re.test(String(this.emailE).toLowerCase())) {
      this.notifyService.showWarning('valid email required', 'Error');
      this.showHighlight('emailE');
      return false;
    }
    if (this.phoneNumberE === "" || !Number(this.phoneNumberE)) {
      this.notifyService.showWarning('Phone no required', 'Error');
      this.showHighlight('phoneNumberE');
      return false;
    }
    const formData = new FormData();
      formData.append('file', this.fileData);
      formData.append('firstName', this.firstNameE);
      formData.append('lastName', this.lastNameE);
      formData.append('email', this.emailE);
      formData.append('phoneNumber', this.phoneNumberE);
      formData.append('profilePicture', this.imageE);
      console.log(formData)
      this.customerService.editCustomer(formData,this.editId)
      .subscribe(res => {
        if(res['success']){
          console.log(res);
          this.customerService.getAllCustomers();
          this.modalClose('editModal')
          this.editId = null
          this.fileData = null;
          this.firstNameE = null;
          this.lastNameE = null;
          this.emailE = null;
          this.phoneNumberE = "";
        } else {
          this.notifyService.showWarning(
            'Failed to add the application form',
            'Error!'
          );
        }
      },
      (err) => {
        console.error('err', err.error.error);
        this.notifyService.showWarning(err.error.error, 'Error');
      } 
    )  
  }

  deleteForm(id) {
    this.deleteId = id
  }

  deleteCustomer(){
    this.customerService.deleteCustomer(this.deleteId)
    .subscribe((res) => {
      if (res['success']) {
        this.rows = this.rows.filter((customer) => customer['_id'] !== this.deleteId)
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

  ngOnDestroy(){
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe()
    })
    this.customerService.customerData$.next(null)
  }

}
