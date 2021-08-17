import { SplineData } from './../Models/SpLineData';
import { AccumulationElec } from './../Models/AccumulationElec';
import { ElecData } from 'src/app/Models/ElecData';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr'
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  //連線
  private hubConnection!: signalR.HubConnection;
  //變數
  public elecData: Array<ElecData> = [];
  /// $data是可被觀察的物件 ，可以在其他component被subscribe
  private dataSubject = new BehaviorSubject<Array<ElecData>>([]);
  private dataSubjectBar = new BehaviorSubject<Array<AccumulationElec>>([]);
  private dataSubjectSpline = new BehaviorSubject<Array<SplineData>>([]);
  private dataSubjectDate = new BehaviorSubject<Array<SplineData>>([]);
  private dataSubjectMonth = new BehaviorSubject<Array<SplineData>>([]);
  private dataSubjectNow = new BehaviorSubject<Array<ElecData>>([]);
  $data = this.dataSubject.asObservable();
  $dataBar = this.dataSubjectBar.asObservable();
  $dataSpline = this.dataSubjectSpline.asObservable();
  $dataDate = this.dataSubjectDate.asObservable();
  $dataMonth = this.dataSubjectMonth.asObservable();
  $dataNow = this.dataSubjectNow.asObservable();
  show=true;
  splineTempLength=0;
  monthTempLength=0;

  public StartConnection=()=>{
  this.monthTempLength=0
  this.splineTempLength=0
    this.hubConnection=new signalR.HubConnectionBuilder()
      // 後端網址
      .withUrl(environment.baseUrl+'dashboard')
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
    this.hubConnection
      .start()
      .then(()=>{
        this.RefreshDashBoardData();
        console.log("Connecting started")
      })
      .catch(err=>console.log('Error while starting connection: '+err));
  }

  ReceiveListener():signalR.HubConnection{
    return this.hubConnection;
  }
  Register(sID:number):void{
    console.log(this.hubConnection.state)
    this.hubConnection.invoke('Register',sID).then(data=>{
      console.log(data);
    });
  }

  public addTransferBroadcastDataListener =()=>{
    //訂閱 transferdata
    this.hubConnection.on('transferdata',(data)=>{
      // console.log(data)
      this.dataSubject.next(data);
    });
    this.hubConnection.on('transferdataBar',(barData)=>{
      // console.log('barData= ',barData);
      this.dataSubjectBar.next(barData);
    });
    this.hubConnection.on('transferdataHour',(hourData)=>{
      if(hourData.length!=this.splineTempLength){
        console.log(hourData)
        this.dataSubjectSpline.next(hourData);
        // console.log('hourData= ',hourData)
        this.splineTempLength=hourData.length;
      }
    })
    this.hubConnection.on('transferdataDate',(dateData)=>{
      // console.log('dateData= ',dateData);
      this.dataSubjectDate.next(dateData);
    });
    this.hubConnection.on('transferdataMonth',(monthData)=>{
      //每次資料長度有異動時 = 有增加新的值 再推送到圖表
      if(monthData.length!=this.monthTempLength){
        // console.log(monthData)
        this.dataSubjectMonth.next(monthData);
        // console.log('monthData= ',monthData);
        this.monthTempLength=monthData.length;
      }
    });
    this.hubConnection.on('RefreshDashBoardData',(nowData)=>{
      // console.log('nowData= ',nowData);
      this.elecData=nowData;
      this.dataSubjectNow.next(nowData);
    });
  }

  RefreshDashBoardData(): void {
    this.hubConnection.invoke('ReturnDashBoardDataToAll').catch((err: any) => console.error(err));
  }
}
