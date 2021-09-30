import { HomeService } from './../home/home.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignalRService } from '../services/signal-r.service';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  path='dashboard';
  constructor(
    private router:Router,
    public signalRService:SignalRService,
  ) { }

  ngOnInit(): void {
    this.path=this.router.url.split('/').pop() as any;
    //連接singalR
    this.signalRService.StartConnection();
    //signalR事件監聽器
    this.signalRService.addTransferBroadcastDataListener();

  }
  Goto(){
    this.signalRService.show=true;
    this.signalRService.RefreshDashBoardData();
    this.signalRService.GetDeviceNameList();
  }
}
