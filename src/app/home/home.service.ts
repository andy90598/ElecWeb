import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  public deviceNameList=["電燈","冷氣","電腦A","電腦B","電腦C","電腦D","冷氣E"];

  constructor() { }
}
