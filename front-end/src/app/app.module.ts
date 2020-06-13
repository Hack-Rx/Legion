import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth/auth.guard';
import { AuthInterceptor } from './auth/auth.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { appRoutes } from './route';
import { SignupComponent } from './home/signup/signup.component';
import { LoginComponent } from './home/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { SymptomComponent } from './dashboard/symptom/symptom.component';
import { MedicalComponent } from './dashboard/medical/medical.component';
import { ReportComponent } from './dashboard/symptom/report/report.component';
import { ProtecttionTipsComponent } from './dashboard/protecttion-tips/protecttion-tips.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignupComponent,
    LoginComponent,
    DashboardComponent,
    ProfileComponent,
    SymptomComponent,
    MedicalComponent,
    ReportComponent,
    ProtecttionTipsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatDialogModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true},
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
