import { Routes } from "@angular/router";
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { SignupComponent } from './home/signup/signup.component';
import { LoginComponent } from './home/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const appRoutes: Routes=[
    {
        path: 'signup', component: HomeComponent,
        children: [{path:'',component:SignupComponent}],
    },
    {
        path: 'login', component: HomeComponent,
        children: [{path:'',component:LoginComponent}],
    },
    {
        path: 'dashboard', component: DashboardComponent,canActivate:[AuthGuard]
    },
    {
        path: '', redirectTo: '/login', pathMatch:'full'
    }
]