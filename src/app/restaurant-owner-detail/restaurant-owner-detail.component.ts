import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { RestaurantOwnerService } from '../core/services/restaurant-owner-service/restaurant-owner.service';
import { NotificationService } from '../core/services/notification-service/notification.service';
import { environment } from './../../environments/environment';
import * as $ from 'jquery';
declare var $: any;
import { DatatableComponent } from '@swimlane/ngx-datatable';


@Component({
  selector: 'app-restaurant-owner-detail',
  templateUrl: './restaurant-owner-detail.component.html',
  styleUrls: ['./restaurant-owner-detail.component.css', '../subadmin-detail/subadmin-detail.component.css']
})
export class RestaurantOwnerDetailComponent implements OnInit {
  @ViewChild('myTable') 
  table: DatatableComponent;

  rows: any = []
  temp = []
  subscriptions: Subscription[] = [];
  deleteId: string = null
  editId: string= null

  imageUrl: string = null;

  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;

  firstNameE : string = null;
  lastNameE : string = null;
  emailE: string = null
  businessNameE: string = null
  phoneNumberE: string = "";
  imageE: string = null;
  previewUrlE: any = null;

  constructor(private restaurantOwnerService: RestaurantOwnerService, private notifyService: NotificationService) { 
    this.imageUrl = environment.imageBase;
    this.restaurantOwnerService.getAllRestaurantOwners()
    this.subscriptions[0] = this.restaurantOwnerService.resOwnerData$.subscribe(data => {
      if (data && data.length > 0) {
        this.rows = data;
        this.temp = [...data];
      }
    });
  }

  ngOnInit(): void {
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
  
  modalClose(modalId) {
    $(`#${modalId}`).trigger('click');
  }

  changeStatus(id, e){
    let status = e.target.checked ? "active" : "blocked"
    const object = {
      status
    }
    this.restaurantOwnerService.changeStatus(id, object)
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
  
  editForm(id , i){
    const editData =  this.rows.find(row => row._id === id);

    console.log('editData',editData);
    this.firstNameE  = editData.firstName;
    this.lastNameE  = editData.lastName;
    this.emailE = editData.email;
    this.businessNameE = editData.businessName
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
    if (this.businessNameE === null) {
      this.notifyService.showWarning('Business name required', 'Error');
      this.showHighlight('businessNameE');
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
      formData.append('businessName', this.businessNameE);
      formData.append('profilePicture', this.imageE);
  
      this.restaurantOwnerService.editRestaurantOwner(formData,this.editId)
      .subscribe(res => {
        if(res['success']){
          console.log(res);
          this.restaurantOwnerService.getAllRestaurantOwners();
          this.modalClose('editModal')
          this.editId = null
          this.fileData = null;
          this.firstNameE = null;
          this.lastNameE = null;
          this.emailE = null;
          this.businessNameE = null
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

  deleteRestaurantOwner(){
    this.restaurantOwnerService.deleteRestaurantOwner(this.deleteId)
    .subscribe((res) => {
      if (res['success']) {
        this.rows = this.rows.filter((resOwner) => resOwner['_id'] !== this.deleteId)
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
    this.restaurantOwnerService.resOwnerData$.next(null)
  }

}
