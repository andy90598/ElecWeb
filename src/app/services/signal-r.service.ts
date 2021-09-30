import { SplineData } from './../Models/SpLineData';
import { AccumulationElec } from './../Models/AccumulationElec';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr'
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Subject } from 'rxjs';

export class Device{
  id:string ="";
  name:string="";
}

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  //連線
  private hubConnection!: signalR.HubConnection;
  //變數
  public elecData: Array<AccumulationElec> = [];
  /// $data是可被觀察的物件 ，可以在其他component被subscribe

  private dataSubjectBar = new BehaviorSubject<Array<AccumulationElec>>([]);
  private dataSubjectSpline = new BehaviorSubject<Array<SplineData>>([]);
  private dataSubjectMonth = new BehaviorSubject<Array<SplineData>>([]);
  private dataSubjectNow = new Subject<Array<AccumulationElec>>();
  private dataSubjectNameList = new Subject<Array<{id:string,name:string}>>();

  public DeviceNameList = new Array<Device>();

  $dataBar = this.dataSubjectBar.asObservable();
  $dataSpline = this.dataSubjectSpline.asObservable();
  $dataMonth = this.dataSubjectMonth.asObservable();
  $dataNow = this.dataSubjectNow.asObservable();
  $dataNameList = this.dataSubjectNameList.asObservable();

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
        this.GetDeviceNameList();
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
    this.hubConnection.on('transferdataBar',(barData)=>{
      // console.log('barData= ',barData);
      this.dataSubjectBar.next(barData);

    });

    this.hubConnection.on('transferdataHour',(hourData)=>{
      this.splineTempLength = hourData.length
      this.dataSubjectSpline.next(hourData);
      // console.log('hourData= ',hourData)
    });

    this.hubConnection.on('transferdataMonth',(monthData)=>{
        this.monthTempLength=monthData.length;
        this.dataSubjectMonth.next(monthData);
      // }
    });

    this.hubConnection.on('RefreshDashBoardData',(nowData)=>{
      // console.log('nowData= ',nowData);
      this.elecData=nowData;
      this.dataSubjectNow.next(nowData);
      this.show=false;
    });

    this.hubConnection.on('SendDeviceNameList',(deviceNameList)=>{
      this.dataSubjectNameList.next(deviceNameList);
      this.DeviceNameList=deviceNameList;
      // console.log (deviceNameList);
    });
  }

  RefreshDashBoardData(): void {
    this.hubConnection.invoke('ReturnDashBoardDataToAll').catch((err: any) => console.error(err));
  }
  GetDeviceNameList(): void{
    this.hubConnection.invoke('ReturnDeviceNameList').catch((err:any)=>console.log(err));
  }
}
