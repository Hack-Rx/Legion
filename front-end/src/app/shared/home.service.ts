import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  // url1="user";
  url1="http://localhost:3000/user";

  constructor(public http:HttpClient) { }

  noAuthHeader= {headers: new HttpHeaders({'NoAuth': 'Ture'})}

  signUp(data){
    return this.http.post(this.url1+'/signup',data,this.noAuthHeader);
  }

  login(data){
    return this.http.post(this.url1+'/signin',data,this.noAuthHeader);
  }
  
  setToken(token: string){
    localStorage.setItem('token',token);
  }

  deletetoken(){
    localStorage.removeItem('token');
  }

  getuserpayload(){
    var token=localStorage.getItem('token');
    if(token){
      var userpayload=atob(token.split('.')[1]);
      return JSON.parse(userpayload);
    }
    else{
      return null;
    }
  }

  isloggedin(){
    var userpayload=this.getuserpayload();
    if(userpayload){
      return userpayload.exp>Date.now()/1000;
    }
    else{
      return false
    }
  }

}
