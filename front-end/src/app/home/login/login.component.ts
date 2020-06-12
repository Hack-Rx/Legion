import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/shared/home.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  successMessage;
  errorMessage;
  email;
  password;

  constructor(public homeservice: HomeService, public router: Router, public route: ActivatedRoute) { }

  ngOnInit(): void {
    if(this.homeservice.isloggedin()){
      this.router.navigateByUrl('/dashboard');
    }
    var success= this.route.snapshot.queryParamMap.get('success');
    console.log(success);
    if(success=="signup"){
      this.successMessage="Registration successful, login to continue";
      this.clearParams();
      setTimeout(() => {
        this.successMessage=null;
      }, 4000);
    }
    else if(success=="logout"){
      this.successMessage="logout successful";
      this.clearParams();
      setTimeout(() => {
        this.successMessage=null;
      }, 4000);
    }
  }

  clearParams(){
    this.router.navigate(
      ['.'], 
      { relativeTo: this.route}
    );
  }

  login(){
    let data={
      email:this.email,
      password:this.password
    };
    this.homeservice.login(data).subscribe(res=>{
      this.homeservice.setToken(res['token']);
      this.router.navigateByUrl('/dashboard');
    },err=>{
      this.errorMessage=err.error.message;
      setTimeout(() => {
        this.errorMessage=null;
      }, 4000);
    })
  }

}
