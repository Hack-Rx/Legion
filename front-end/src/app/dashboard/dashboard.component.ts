import { Component, OnInit } from '@angular/core';
import { HomeService } from '../shared/home.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(public homeservice: HomeService, public router: Router) { }

  ngOnInit(): void {
  }

  logout(){
    this.homeservice.deletetoken();
    this.router.navigateByUrl('/login?success=logout');
  }

}
