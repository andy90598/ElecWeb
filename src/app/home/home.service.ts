import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  public deviceNameList=["電燈", "電腦B","電腦D","電燈B","電燈D","冷氣", "電腦C","冷氣E", "電燈C","電腦A","電燈A"];
  public deviceIDList = ["0081F924C0C6","0081F9254E13","0081F9254E61","0081F9254F0F","0081F92550C8","0081F925516D","0081F92551A7",]

  constructor() { }
}
