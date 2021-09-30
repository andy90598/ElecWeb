import { HttpEvent, HttpHandler, HttpHeaderResponse, HttpInterceptor,HttpRequest, HttpResponseBase } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpResponse } from '@microsoft/signalr';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SpinnerService } from '../spinner/spinner.service';
@Injectable()

//http攔截器
export class AuthHeaderInterceptor implements HttpInterceptor{

  constructor(
    private spinnerService:SpinnerService
  ){}
  intercept(req:HttpRequest<any>,next:HttpHandler):Observable<HttpEvent<any>>{
    //一送出需求時 就console.log出來
    console.log('Auth Intercept Provider');
    console.log(req.url);
    const authToken = "My Token";
    //設headers 的 Authorization
    // const authReq=req.clone({
    //   setHeaders:{Authorization:authToken}
    // });
    this.spinnerService.RequsetStarted();
    return this.handler(next,req);
  }
  handler(next:any,req:any){
    return next.handle(req)
      .pipe(
        tap(
          (event:HttpEvent<any>)=>{
            if(event instanceof HttpResponseBase){
              this.spinnerService.RequsetEnded();
            }
          },
          (error:HttpResponse)=>{
            this.spinnerService.ResetSpinner();

            throw error;
          }
        ),
      );
  }

}
