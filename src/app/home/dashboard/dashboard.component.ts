import { SignalRService } from './../../services/signal-r.service';
import { Chart } from 'angular-highcharts';
import { DonutChart } from './../../Models/DonutChart';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ElecData } from 'src/app/Models/ElecData';
import { ElecRowData } from 'src/app/Models/ElecRowData';
import { HttpService } from 'src/app/services/http.service';
import { Options } from 'highcharts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  @ViewChild("Ac_Server") element!: ElementRef;
  //從192.168.140.80:9100撈到的資料
  elecRowDataList:Array<ElecRowData>=[];
  //從192.168.140.80:9210撈到的資料
  elecDataList:Array<ElecData>=[];
  //控制 setInterval()生命週期
  id:any
  //設備名稱表
  deviceNameList=["壞掉","機台","冷氣"]
  chart=new Chart()

  constructor(
    private httpService:HttpService,
    public signalRService:SignalRService,
  ) { }

  ngOnInit(): void {
    //連接singalR
    this.signalRService.StartConnection();
    //signalR事件監聽器
    this.signalRService.addTransferBroadcastDataListener();
    this.GetInit();
    //訂閱 signalRService的 $data 當$data變動時收到資料
    this.signalRService.$data.subscribe(x=>{
      // 甜甜圈圖表樣板
      let options = new DonutChart();
      // 設備名稱跟值的表
      let elecDeviceList=new Array();
      // 讓elecDataList = 訂閱收到的值
      this.elecDataList=x;
      // 跑回圈 把elecDevice塞到elecDeviceList <name|value>
      this.elecDataList.forEach((x,index)=>{
        const elecDevice = new Array<string|number>();
        elecDevice[0]=this.deviceNameList[index];
        elecDevice[1]=x.value;
        elecDeviceList.push(elecDevice)
      })
      // 陣列合併 把 elecDeviceList 第一筆去掉後塞到 options.options.series[0].data 裡
      Array.prototype.push.apply(options.options.series[0].data,elecDeviceList.slice(1))
      // 設this.chart的options 要把從donutChart這個class的型別轉換成 highcharts 的 Options
      this.chart=new Chart(options.options as Options)
      console.log(this.chart)
    })
    this.id=setInterval(()=>{
      this.GetInit();
    },10000)
  }

  GetInit(){
    this. GetRowData();
  }

  GetRowData(){
    this.httpService.get("http://192.168.140.80:9100/list").subscribe(x=>{
      this.elecRowDataList=x
      // console.log('this.elecRowDataList',this.elecRowDataList)
    })
  }

  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }
  }

}
