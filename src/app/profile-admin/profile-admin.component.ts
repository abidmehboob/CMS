import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SuperuserService } from '../core/services/superuser-service/superuser.service';
import { NotificationService } from '../core/services/notification-service/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from '../shared/models/response.model';
import { environment } from './../../environments/environment';
import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'app-profile-admin',
  templateUrl: './profile-admin.component.html',
  styleUrls: ['./profile-admin.component.css']
})
export class ProfileAdminComponent implements OnInit {
  subscriptions: Subscription[] = [];

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

  currentPassword: string = ""
  newPassword: string = ""
  confirmPassword: string = ""

  constructor(
    private notifyService: NotificationService,
    private superuserService: SuperuserService,
    private router: Router
  ) {
    this.imageUrl = environment.imageBase;
    this.superuserService.getSuperuser();
    this.subscriptions[0] = this.superuserService.superuser$.subscribe(
      (data) => {
        if (data) {
          this.firstNameE = data.firstName
          this.lastNameE = data.lastName
          this.emailE = data.email
          this.phoneNumberE = data.phoneNumber
          this.imageE = data.profilePicture
          this.previewUrlE = this.imageUrl+data.profilePicture;
        }
      }
    );
  }

  ngOnInit(): void {}
  
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
  
  onSubmitEdit() {
    console.log('this.fileData',this.fileData);
    console.log(this.firstNameE)
  
    this.resetHighlight();
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.firstNameE === null || this.firstNameE === '') {
      this.notifyService.showWarning('First name required', 'Error');
      this.showHighlight('firstNameE');
      return false;
    }

    if (this.lastNameE === null || this.lastNameE === '') {
      this.notifyService.showWarning('Last name required', 'Error');
      this.showHighlight('lastNameE');
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
      this.superuserService.editSuperuser(formData)
      .subscribe(res => {
        if(res['success']){
          console.log(res);
          this.notifyService.showSuccess('Profile Updated Successfully', 'Success')
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
  editPass(){
    this.resetHighlight();

    if (this.currentPassword.trim() === '') {
      this.notifyService.showWarning('password required', 'Error');
      this.showHighlight('currentPassword');
      return false;
    }
    if (this.newPassword.trim() === '') {
      this.notifyService.showWarning('password required', 'Error');
      this.showHighlight('newPassword');
      return false;
    }

    if (this.confirmPassword.trim() === '') {
      this.notifyService.showWarning('confirm Password required', 'Error');
      this.showHighlight('confirmPassword');
      return false;
    }
    if (this.newPassword.trim() !== this.confirmPassword.trim()) {
      this.notifyService.showWarning('Password Dont Matched', 'Error');
      this.showHighlight('confirmPassword');
      return false;
    }
    const obj = {
      currentPass: this.currentPassword,
      newPass: this.newPassword
    }
    this.superuserService.editPass(obj)
    .subscribe(res => {
      if(res['success']){
        console.log(res);
        this.notifyService.showSuccess('Password Updated Successfully', 'Success')
        $('.form-c').val('');
      }else {
        this.notifyService.showWarning(
          'Failed to update',
          'Error!'
        );
      }
    },
    (err) => {
      console.error('err', err.error.error);
      this.notifyService.showWarning(err.error.error, 'Error');
    })
  }
  
  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.superuserService.superuser$.next([]);
  }
}
