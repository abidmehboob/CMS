import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SubadminService } from '../core/services/subadmin-service/subadmin.service';
import { NotificationService } from '../core/services/notification-service/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from '../shared/models/response.model';
import { environment } from './../../environments/environment';
import * as $ from 'jquery';
declare var $: any;
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ListingService } from '../core/services/listing-service/listing.service';
import { SigninService } from './../core/services/signin-service/signin.service';

@Component({
  selector: 'app-subadmin-detail',
  templateUrl: './subadmin-detail.component.html',
  styleUrls: ['./subadmin-detail.component.css'],
})

export class SubadminDetailComponent implements OnInit {

  @ViewChild('myTable') table: DatatableComponent;
  temp = []
  rows: any = [];

  name: string = null;
  phoneNumber: string = null;
  email: string = null;
  password: string = '';
  confirmPassword: string = '';

  subscriptions: Subscription[] = [];
  deleteId: string = null
  editId: string = null

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

  permissions: any = {}
  permissionsE: any = {}
  roles : any;
  hotels : any;
  hotel_id : string = "";
  role_id : string = "0";
  action = "Add";
  mode = 1;
  perPage = 20;
  totalElements = 0;
  adminType = 0;
  saveDisabled = false;
  btn = "Submit";
  

  constructor(
    private notifyService: NotificationService,
    private subadminService: SubadminService,
    private router: Router,
    private listingService: ListingService,
    private  signinService :SigninService

  ) {
    this.imageUrl = environment.imageBase;
    console.log(this.imageUrl)
    
    this.subadminService.getAllSubadmins(0,'');
    this.subadminService.getAllRoles();
    this.listingService.getAllHotel(0,'');
    
    this.subscriptions[1] = this.listingService.listingData$.subscribe(
      (data) => {
        if (data) {
          this.hotels = data['content'];
        }
      });

    this.subscriptions[0] = this.subadminService.subadminData$.subscribe(
      (data) => {
        console.log(data)
        if (data) {
          this.totalElements = data.totalElements;
          this.rows = data['content'];
          this.temp = data['content'];
          
//          this.temp = [...data];
        }
      }
    );

    this.subscriptions[1] = this.subadminService.roleData$.subscribe(
      (data) => {
        console.log("roles",data)
        if (data && data.length > 0) {
          this.roles = data;
        }
      }
    );

    
  }
  pageChange(e){
    console.log("e",e.page);
    this.subadminService.getAllSubadmins(e.page-1,'');


  }

  ngOnInit(): void {
    this.subscriptions[2] =  this.signinService.roles$.subscribe(resp=>{
      if(resp){
         console.log("resp.permission",resp.type);
         if(resp.type == 'Admin'){
            this.adminType = 1;
         }
         if(resp.type == 'SuperAdmin'){
          this.adminType = 0;
       }

      }
    });

  }
  
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
      if(val.length === 0){
          this.subadminService.getAllSubadmins(0,'');

      }else if(val.length > 3){
         setTimeout(() => {
          this.subadminService.getAllSubadmins(0,val);

         }, 500); 
      }

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
      this.previewUrl = reader.result;
      this.previewUrlE = reader.result;
    };
  }

  removeImg(){
    this.previewUrlE = null;
  }
  
  cancel(){
    this.previewUrl = null;
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

  createSubadmin() {
    this.resetHighlight();
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.name === null) {
      this.notifyService.showWarning('Name required', 'Error');
      this.showHighlight('name');
      return false;
    }
    if (this.email === null) {
      this.notifyService.showWarning('email required', 'Error');
      this.showHighlight('email');
      return false;
    }
    if (!re.test(String(this.email).toLowerCase())) {
      this.notifyService.showWarning('valid email required', 'Error');
      this.showHighlight('email');
      return false;
    }
    if (this.phoneNumber === null || !Number(this.phoneNumber)) {
      this.notifyService.showWarning('Phone no required', 'Error');
      this.showHighlight('phoneNumber');
      return false;
    }
    if(this.mode === 1){
      if (this.password.trim() === '') {
        this.notifyService.showWarning('password required', 'Error');
        this.showHighlight('password');
        return false;
      }
      if (this.confirmPassword.trim() === '') {
        this.notifyService.showWarning('confirm Password required', 'Error');
        this.showHighlight('confirmPassword');
        return false;
      }
      if (this.password.trim() !== this.confirmPassword.trim()) {
        this.notifyService.showWarning('Password Dont Matched', 'Error');
        this.showHighlight('confirmPassword');
        return false;
      }
      this.saveDisabled = true;
      this.btn = "Please Wait ";
  
      let employeeObject = {
        "email" : this.email,
        "name": this.name,
        "password": this.password,
        "phone": this.phoneNumber,
        "role_id": this.role_id,
        "hotel_id" : this.hotel_id
      };
  
      this.subadminService.createEmployee(employeeObject).subscribe(
        (res: ApiResponse) => {
          console.log(res);
          if (res['employee_id']) {
            this.saveDisabled = false;
            this.btn = "Submit";
        
            this.subadminService.getAllSubadmins(0,'');
    
            this.modalClose('createModal');
            $('.form-control').val('');
          } else {
            this.saveDisabled = false;
            this.btn = "Submit";

            this.notifyService.showWarning(
              'Failed to add the Employee',
              'Error!'
            );
          }
        },
        (err) => {
          this.saveDisabled = false;
          this.btn = "Submit";

          console.error('err', err.error.error);
          this.notifyService.showWarning(err.error.error, 'Error');
        }
      );
        
    }
    else{
      let employeeObject = {
        "email" : this.email,
        "name": this.name,
        "phone": this.phoneNumber,
        "role_id": this.role_id,
        "hotel_id" : this.hotel_id,
        "employee_id" : this.editId
      };
      this.saveDisabled = true;
      this.btn = "Please Wait ";
 
      this.subadminService.editEmployee(employeeObject,this.editId).subscribe(
        (res: ApiResponse) => {
          console.log(res);
          if (res['id']) {
            this.saveDisabled = false;
            this.btn = "Submit";

            this.subadminService.getAllSubadmins(0,'');
            this.notifyService.showWarning(
              'Successfully Edit.',
              'Success!'
            );
 
            this.modalClose('createModal');
            $('.form-control').val('');
          } else {
            this.saveDisabled = false;
            this.btn = "Submit";

            this.notifyService.showWarning(
              'Failed to edit the Employee',
              'Error!'
            );
          }
        },
        (err) => {
          console.error('err', err.error.error);
          this.saveDisabled = false;
          this.btn = "Submit";

          this.notifyService.showWarning(err.error.error, 'Error');
        }
      );      
    }

    
  }

  changeStatus(id, e){
    let status = e.target.checked ? "active" : "blocked"
    const object = {
      status
    }
    this.subadminService.changeStatus(id, object)
  }
  cm(){
    this.action = "Add";
    this.mode = 1;
    this.email = null;
    this.name = null;
    this.password = null;
    this.phoneNumber = null;
    this.role_id = '0';
    this.hotel_id = null;

 
  }
  editForm(id , i){
    this.mode = 2;
    this.editId = id;
    this.action = "Edit";
    const editData =  this.rows.find(row => row.employee_id === id);
      console.log("editData.role_id",editData)
    this.email = editData.email;
    this.name = editData.name;
    this.phoneNumber = editData.phone;
    this.role_id = (typeof editData.role_id == "undefined") ? "0" : editData.role_id;
    this.hotel_id = editData.hotel_id

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
    if(Object.keys(this.permissionsE).every((value) => this.permissionsE[value]=== false)){
      this.notifyService.showWarning('Please grant at least one permission','Error')
      return false;
    }
    console.log(this.permissionsE)
    const formData = new FormData();
      formData.append('file', this.fileData);
      formData.append('firstName', this.firstNameE);
      formData.append('lastName', this.lastNameE);
      formData.append('email', this.emailE);
      formData.append('phoneNumber', this.phoneNumberE);
      formData.append('profilePicture', this.imageE);
      formData.append('permissions', JSON.stringify(this.permissionsE))
      
      this.subadminService.editSubadmin(formData,this.editId)
      .subscribe(res => {
        if(res['success']){
          console.log(res);
          this.notifyService.showSuccess('Updated Successfully', 'Success')
          this.subadminService.getAllSubadmins(0,'');
          this.modalClose('editModal')
          this.editId = null
          this.fileData = null;
        }else {
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

  deleteSubadmin(){
    this.subadminService.deleteSubadmin(this.deleteId)
    .subscribe((res) => {
      if (res['success']) {
        this.rows = this.rows.filter((subadmin) => subadmin['_id'] !== this.deleteId)
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

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subadminService.subadminData$.next([]);
  }
}
