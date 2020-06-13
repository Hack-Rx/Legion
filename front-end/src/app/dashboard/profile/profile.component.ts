import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/shared/dashboard.service';
import { HomeService } from 'src/app/shared/home.service';
import { Router } from '@angular/router';
import { Chart } from 'node_modules/chart.js';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userDetails;
  dates;
  risk;
  medicalData;
  symptomHistory;
  isSymptomHistory;

  constructor(public dashboardservice: DashboardService,public homeservice: HomeService,public router: Router) {
    this.dashboardservice.newSymptomAdded().subscribe(data=>{
      this.ngOnInit();
    })
   }

  ngOnInit(): void {
    this.dashboardservice.getUserProfile().subscribe(res=>{
      console.log(res);
      this.userDetails=res['user'];
    })

    this.dashboardservice.isMedicalDataAvailable().subscribe(res=>{
      if(res['status']==false){
        this.medicalData=null;
      }
      else{
        this.dashboardservice.getMedicalData().subscribe(res=>{
          this.medicalData=res;
          console.log(this.medicalData);
        },err=>{
          console.log(err);
        })
      }
    },err=>{
      console.log(err);
    })

    this.dashboardservice.getSymptomHistory().subscribe(res=>{
      console.log("symptomhistory- ",res);
      if(res[0])
      this.isSymptomHistory=true;
      this.symptomHistory=res;
    },err=>{
      console.log(err);
    })

    this.dashboardservice.getRiskData().subscribe(res=>{
      console.log(res);
      this.dates=res['date'];
      this.risk=res['risk'];
      var myChart = new Chart("mychart", {
          type: 'line',
          data: {
              labels: (this.dates),
              datasets: [{
                  label: 'risk level',
                  data: this.risk,
                  backgroundColor: 'lightblue',
                  borderColor: 'blue',
                  borderWidth: 1
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero: true
                      }
                  }]
              }
          }
      });
    })

  }

}
