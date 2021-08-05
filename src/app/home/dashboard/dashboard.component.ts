declare var require: any;
import { SignalRService } from './../../services/signal-r.service';
import { Chart } from 'angular-highcharts';
import { DonutChart } from './../../Models/DonutChart';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ElecData } from 'src/app/Models/ElecData';
import { ElecRowData } from 'src/app/Models/ElecRowData';
import { HttpService } from 'src/app/services/http.service';
import { Options } from 'highcharts';
import { BarChart } from 'src/app/Models/BarChart';
import * as Highcharts from 'highcharts';


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
  donutchart=new Chart();
  updateFlag = false;
  Highcharts = Highcharts;
  chartConstructor = "chart";
  // chartOptions={
  //   chart:{
  //     type:'bar',
  //     spacing : [20, 0 , 0, 0], //margin 上左下右,
  //   },
  //   title: {
  //     text: '當前耗電量/瓦'
  //   },
  //   subtitle: {
  //     text: ""
  //   },
  //   exporting:{
  //     enabled:true
  //   },
  //   plotOptions: {
  //     bar:{
  //       showInLegend: false,
  //       colorByPoint: true,
  //       dataLabels: {
  //         enabled: true,
  //         format: '{y} 瓦',
  //         style: {
  //           fontSize:'24px'
  //         }
  //       },
  //     }
  //   },
  //   xAxis: {
  //       categories: ['機台', '冷氣'],
  //       title: {
  //         text: '設備名稱'
  //       }
  //   },
  //   yAxis: {
  //     title: {
  //       text: '瓦'
  //     }
  //   },
  //   series: [
  //     {
  //       type:"bar",
  //       data:[1,2],
  //     }
  //   ]
  // } as any
  barChart = new BarChart;

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
      this.donutchart=new Chart(options.options as Options)
    })

    this.signalRService.$dataBar.subscribe(x=>{
      const accumulationElecList =new Array
      let time=""
      x.forEach(y=>{
        accumulationElecList.push(Math.round(y.value*110))
        time=y.time
      })
      this.barChart.chartOptions.series[0].data=accumulationElecList ;
      this.barChart.chartOptions.subtitle.text="最後更新時間: "+time;
      this.updateFlag=true;
    })
  }

  GetInit(){

  }
}
