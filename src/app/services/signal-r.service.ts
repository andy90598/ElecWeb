import { AccumulationElec } from './../Models/AccumulationElec';
import { ElecData } from 'src/app/Models/ElecData';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr'
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';


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
  $data = this.dataSubject.asObservable();
  $dataBar = this.dataSubjectBar.asObservable();

  public StartConnection=()=>{
    this.hubConnection=new signalR.HubConnectionBuilder()
      // 後端網址
      .withUrl(environment.baseUrl+'dashboard')
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
    this.hubConnection
      .start()
      .then(()=>console.log("Connecting started"))
      .catch(err=>console.log('Error while starting connection: '+err));
  }

  ReceiveListener():signalR.HubConnection{
    return this.hubConnection;
  }
  Register(sID:number):void{
    console.log(this.hubConnection.state);
    this.hubConnection.invoke('Register',sID).then(data=>{
      console.log(data);
    });
  }
  public addTransferBroadcastDataListener =()=>{
    //訂閱 transferdata
    this.hubConnection.on('transferdata',(data)=>{
      // console.log(data)
      this.elecData=data;
      this.dataSubject.next(data);
    });
    this.hubConnection.on('transferdataBar',(barData)=>{
      // console.log(barData);
      this.dataSubjectBar.next(barData);
    });
    this.hubConnection.on('transferdataHour',(hourData)=>{
      // console.log(hourData)
    })
  }
}
