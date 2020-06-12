import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/shared/dashboard.service';

@Component({
  selector: 'app-medical',
  templateUrl: './medical.component.html',
  styleUrls: ['./medical.component.css']
})
export class MedicalComponent implements OnInit {
  displayControl;
  age;
  smoker=0;
  bp=0;
  diabities=0;
  heart=0;
  lung=0;

  constructor(public dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.displayControl=0;
  }

  setSmoker(data){
    this.smoker=data;
  }

  setBP(data){
    this.bp=data;
  }

  setDiabities(data){
    this.diabities=data;
  }

  setHeart(data){
    this.heart=data;
  }

  setLung(data){
    this.lung=data;
  }

  sendData(){
    console.log(this.smoker, this.bp, this.diabities, this.heart, this.lung, this.age);
    var data={
      age:this.age,
      smoker:this.smoker,
      bp:this.bp,
      diabities:this.diabities,
      heart:this.heart,
      lung:this.lung
    }
    this.dashboardService.postMedicalData(data).subscribe(res=>{
      console.log(res);
    })
  }

}
