import { Component, OnInit } from '@angular/core';
import { SigninService } from '../core/services/signin-service/signin.service';
import { NgForm } from '@angular/forms';
import * as $ from 'jquery'
import { NotificationService } from '../core/services/notification-service/notification.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']

})
export class SigninComponent implements OnInit {
  email : String;
  password : String = '';
  saveDisabled = false;
  btn = "Sign in";

  constructor(private signinService: SigninService, private notifyService: NotificationService) { }
  
  resetHighlight(){
    let elem = document.getElementsByClassName("form-c");
    //elem.style = "color:red; border: 1px solid red";
    $('.form-c').css('border','');

  }

  showHighlight(e){
    
    let elem: HTMLElement = document.getElementById(e);
    elem.setAttribute("style", "border: 1px solid red;"); 
  }

  signin(){
    this.resetHighlight();
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (this.email === null) {
      this.notifyService.showWarning("email required", "Error");
      this.showHighlight('email');
      return false;
    }

    if (!re.test(String(this.email).toLowerCase())) {
      this.notifyService.showWarning("Invalid email required", "Error");
      this.showHighlight('email');
      return false;
    }
    if (this.password.trim() === '') {
      this.notifyService.showWarning("password required", "Error");
      this.showHighlight('password');
      return false;
    }
    this.saveDisabled = true;
    this.btn = "Please Wait ";
  
    let signin = {
      email : this.email,
      password : this.password
    }
    this.signinService.signin(signin);
    setTimeout(() => {
      this.saveDisabled = false;
      this.btn = "Sign In";
  
    }, 2500);

  }

  ngOnInit(): void {
  }

}
