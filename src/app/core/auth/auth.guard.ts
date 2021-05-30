import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { SigninService } from '../services/signin-service/signin.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private as: SigninService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('state', state)
    return this.as.isLoggedIn(state);
    
  }
}
