import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private count =0;
  private spinner$ = new BehaviorSubject<string>('');
  constructor() { }

  GetSpinnerObserver():Observable<string>{
    return this.spinner$.asObservable();
  }

  RequsetStarted(){
    if(++this.count===1){
      this.spinner$.next('start');
    }
  }

  RequsetEnded(){
    if(this.count===0 || --this.count===0){
      this.spinner$.next('stop');
    }
  }

  ResetSpinner(){
    this.count=0;
    this.spinner$.next('stop');
  }
}
