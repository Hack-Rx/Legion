import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { HomeService } from '../shared/home.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(public homeservice:HomeService, public router:Router) {}


  intercept(req: HttpRequest<any>, next: HttpHandler){
    if(req.headers.get('noauth'))
        return next.handle(req.clone());
    else{
        const clonereq=req.clone({
            headers: req.headers.set("Authorization","bearer "+localStorage.getItem('token'))
        });
        return next.handle(clonereq).pipe(
            tap(
                event=>{},
                err=>{
                    if(err.error.auth==false){
                        this.router.navigateByUrl('/login');
                    }
                }
            )
        );
    }
}
}
