import { ElecData } from 'src/app/Models/ElecData';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr'
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  public elecData: Array<ElecData> = [];
  private dataSubject = new BehaviorSubject<Array<ElecData>>([]);
  $data = this.dataSubject.asObservable();




  public StartConnection=()=>{
    this.hubConnection=new signalR.HubConnectionBuilder()
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
    this.hubConnection.on('transferdata',(data)=>{
      this.elecData=data;
      this.dataSubject.next(data);
    });
  }
}
