import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  // url1="user";
  // url2="symptoms";
  url1="http://localhost:3000/user";
  url2="http://localhost:3000/symptoms";

  reload=new Subject();

  constructor(public http: HttpClient) { }

  getUserProfile(){
    return this.http.get(this.url1+'/userProfile');
  }

  getSymptomsList(){
    return this.http.get(this.url2+'/symptomList');
  }

  postSymptoms(symptomData){
    this.ReloadFunction();
    return this.http.post(this.url2+'/addSymptoms',symptomData);
  }

  postMedicalData(data){
    this.ReloadFunction();
    return this.http.post(this.url2+'/medicalData',data);
  }

  isMedicalDataAvailable(){
    return this.http.get(this.url2+'/isMedicalDataAvailable');
  }

  generateReport(){
    this.ReloadFunction();
    return this.http.get(this.url2+'/generateReport');
  }

  getRiskData(){
    return this.http.get(this.url2+'/riskData');
  }

  getMedicalData(){
    return this.http.get(this.url2+'/medicalData');
  }

  getSymptomHistory(){
    return this.http.get(this.url2+'/symptomHistory');
  }

  ReloadFunction(){
    setTimeout(() => {
      this.reload.next(1);
    }, 2000);
  }

  newSymptomAdded(): Observable<any>{
    return this.reload.asObservable();
  }

}
