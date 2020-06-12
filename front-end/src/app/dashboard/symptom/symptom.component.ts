import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/shared/dashboard.service';

@Component({
  selector: 'app-symptom',
  templateUrl: './symptom.component.html',
  styleUrls: ['./symptom.component.css']
})
export class SymptomComponent implements OnInit {
  displayControl;
  symptomList;
  showOptions=0;

  constructor(public dashboardService: DashboardService) { }

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

}
