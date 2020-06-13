import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/shared/dashboard.service';
import { MatDialog } from '@angular/material/dialog';
import { ReportComponent } from './report/report.component';

@Component({
  selector: 'app-symptom',
  templateUrl: './symptom.component.html',
  styleUrls: ['./symptom.component.css']
})
export class SymptomComponent implements OnInit {
  displayControl;
  symptomList;
  showOptions=0;
  report;
  isMedicalDataAvailable;
  errorMessage;
  
  age;
  smoker=0;
  bp=0;
  diabities=0;
  heart=0;
  lung=0;

  constructor(public dashboardService: DashboardService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.displayControl=-1;
    this.dashboardService.isMedicalDataAvailable().subscribe(res=>{
      this.isMedicalDataAvailable=res["status"];
    },err=>{
      console.log(err);
    })
    this.dashboardService.getSymptomsList().subscribe(res=>{
      console.log("symptoms list- ");
      console.log(res);
      this.symptomList=res;
    })
  }

  checkIntensityOptions(itemNo){
    if(this.symptomList[itemNo].isIntensityAvailable==true){
      this.showOptions=1;
    }
    else{
      this.displayControl=this.displayControl+1;
    }
  }

  sendData(){
    console.log(this.symptomList);
    this.dashboardService.postSymptoms(this.symptomList).subscribe(res=>{
      console.log(res);
    },err=>{
      console.log(err);
      this.errorMessage=err.error.message;
      setTimeout(() => {
        this.errorMessage=null;
      }, 4000);
      this.displayControl=0;
    });
  }

  getReport(){
    this.dashboardService.generateReport().subscribe(res=>{
      this.report=res;
      console.log(res);
      this.openReportDialog();
    },err=>{
      console.log(err);
    })
  }

  openReportDialog(): void {
    const dialogRef = this.dialog.open(ReportComponent, {
      width: '1500px',
      height: '500px',
      data: this.report
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


  //medical data related functions
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

  sendMedicalData(){
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
      this.isMedicalDataAvailable=true;
      this.displayControl=-1;
      console.log(res);
    },err=>{
      this.errorMessage=err.error.message;
      setTimeout(() => {
        this.errorMessage=null;
      }, 4000);
      this.displayControl=0;
    })
  }

}
