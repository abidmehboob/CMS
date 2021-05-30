import { SigninService } from './../../core/services/signin-service/signin.service';
import { Component, OnInit } from '@angular/core';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user : any;
  isLogin : Boolean = false;
  
  imageUrl: string = null;

  constructor(private signinService: SigninService) { 
    
    //this.imageUrl = environment.imageBase;
     this.imageUrl = './assets/images/user.png';
    console.log(this.imageUrl)
    let resp = this.signinService.checkSession();
    if(resp){
      this.isLogin = true;
    }
    console.log('respresprespresp',resp);
    this.signinService.user$.subscribe(user => {
      if (user) {
        console.log(user)
        this.user = user;
        this.isLogin = true;
      }
      console.log('login',this.isLogin);
    });
  }

  ngOnInit(): void {
  }
  
  logout(){
    this.signinService.logout();
  }
}
