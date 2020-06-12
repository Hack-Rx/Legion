import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HomeService } from '../shared/home.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private homeservice: HomeService ,private router:Router ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):boolean{
      if(!this.homeservice.isloggedin()){
        this.router.navigateByUrl('/login');
        this.homeservice.deletetoken();
        return false;
      }
    return true;
  }
  
}
