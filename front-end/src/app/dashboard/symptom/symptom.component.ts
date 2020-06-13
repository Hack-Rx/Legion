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

  constructor(public dashboardService: DashboardService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.displayControl=-1;
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

}
