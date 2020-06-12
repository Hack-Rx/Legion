import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/shared/dashboard.service';
import { HomeService } from 'src/app/shared/home.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userDetails;

  constructor(public dashboardservice: DashboardService,public homeservice: HomeService,public router: Router) { }

  ngOnInit(): void {
    this.dashboardservice.getUserProfile().subscribe(res=>{
      console.log(res);
      this.userDetails=res['user'];
    })
  }

  logout(){
    this.homeservice.deletetoken();
    this.router.navigateByUrl('/login?success=logout');
  }

}
