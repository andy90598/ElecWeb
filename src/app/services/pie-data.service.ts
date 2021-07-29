import { StringOption } from './../Models/Options';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PieDataService {
  public mockData : StringOption[]=[];
  private dataSubject = new BehaviorSubject<StringOption[]>(this.mockData);

  $data = this.dataSubject.asObservable();
  addData(newData:StringOption){
    this.mockData.push(newData);
    this.dataSubject.next(this.mockData)
  }
  setData(data:StringOption[]){
    this.mockData = data
    console.log(this.mockData)
    this.dataSubject.next(this.mockData)
  }
  constructor() { }
}
