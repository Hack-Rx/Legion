import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/shared/home.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  name;
  email;
  password;
  successMessage;
  errorMessage;

  constructor(public homeservice: HomeService,public router: Router) { }

  ngOnInit(): void {
  }

  signUp(){
    var data = {
      name: this.name,
      email: this.email,
      password: this.password
    }
    this.homeservice.signUp(data).subscribe(res=>{
      this.router.navigateByUrl('/login?success=signup');
    },err=>{
      this.errorMessage=err.error.message;
      setTimeout(() => {
        this.errorMessage=null;  
      }, 4000);
    })
  }

}
