import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  url1="http://localhost:3000/user";

  constructor(public http: HttpClient) { }

  getUserProfile(){
    return this.http.get(this.url1+'/userProfile');
  }
}
