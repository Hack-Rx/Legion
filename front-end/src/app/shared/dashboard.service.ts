import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  url1="http://localhost:3000/user";
  url2="http://localhost:3000/symptoms";

  constructor(public http: HttpClient) { }

  getUserProfile(){
    return this.http.get(this.url1+'/userProfile');
  }

  getSymptomsList(){
    return this.http.get(this.url2+'/symptomList');
  }

  postSymptoms(symptomData){
    return this.http.post(this.url2+'/addSymptoms',symptomData);
  }
}
