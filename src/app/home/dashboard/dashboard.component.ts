import { AccumulationElec } from './../../Models/AccumulationElec';
import { HomeService } from './../home.service';
import { SignalRService } from './../../services/signal-r.service';
import { DonutChart } from './../../Models/DonutChart';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ElecData } from 'src/app/Models/ElecData';
import { ElecRowData } from 'src/app/Models/ElecRowData';
import { BarChart } from 'src/app/Models/BarChart';
import * as Highcharts from 'highcharts';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit{
  @ViewChild("Ac_Server") element!: ElementRef;
  //從192.168.140.80:9100撈到的資料
  elecRowDataList:Array<ElecRowData>=[];
  //從192.168.140.80:9210撈到的資料
  elecDataList:Array<AccumulationElec>=[];
  //控制 setInterval()生命週期
  id:any
  //設備名稱表
  //圓餅圖
  donutchart=new DonutChart;
  //長方圖
  barChart = new BarChart;
  //圖表是否更新
  updateFlag = false;
  //圖表套件
  Highcharts = Highcharts;
  //圖表套件
  chartConstructor = "chart";

  constructor(
    public signalRService:SignalRService,
    public homeService:HomeService,
    private cd:ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // 一開始近來顯示loading
    this.signalRService.show=true;
    this.signalRService.$dataNow.subscribe(x=>{
      let elecDeviceList=new Array();
      // 讓elecDataList = 訂閱收到的值
      this.elecDataList=x
      // 跑回圈 把elecDevice塞到elecDeviceList <name|value>
      this.elecDataList.forEach((x,index)=>{
        //有資料後把loading關閉
        this.signalRService.show=false;
        const elecDevice = new Array<string|number>();
        elecDevice[0]=x.name;
        elecDevice[1]=x.value;
        elecDeviceList.push(elecDevice)
      })
      // 陣列合併 把 elecDeviceList 第一筆去掉後塞到 options.options.series[0].data 裡
      this.donutchart.options.series[0].data=elecDeviceList;

      //長條圖
      const accumulationElecList =new Array
      let time=""
      x.forEach(y=>{
        accumulationElecList.push(Math.round(y.value*y.volt))
      })
      this.barChart.chartOptions.series[0].data=accumulationElecList ;
      this.barChart.chartOptions.subtitle.text="最後更新時間: "+time;
      this.updateFlag=true;
    })
    this.GetInit()
  }

  GetInit(){
    //圓餅圖
    //訂閱 signalRService的 $data 當$data變動時收到資料
    this.signalRService.$dataBar.subscribe(x=>{
      // 設備名稱跟值的表
      let elecDeviceList=new Array();
      // 讓elecDataList = 訂閱收到的值
      this.elecDataList=x;
      // 跑回圈 把elecDevice塞到elecDeviceList <name|value>
      this.elecDataList.forEach((x,index)=>{
        const elecDevice = new Array<string|number>();
        elecDevice[0]=x.name;
        elecDevice[1]=x.value*x.volt;
        elecDeviceList.push(elecDevice)
      })
      // 陣列合併 把 elecDeviceList 第一筆去掉後塞到 options.options.series[0].data 裡
      this.donutchart.options.series[0].data=elecDeviceList;
    })

    //長條圖
    this.signalRService.$dataBar.subscribe(x=>{
      const accumulationElecList =new Array
      const deviceNameList = new Array
      let time=""
      x.forEach(y=>{
        accumulationElecList.push(Math.round(y.value*y.volt))
        deviceNameList.push(y.name);
        time=y.time
      })

      this.barChart.chartOptions.series[0].data=accumulationElecList ;
      this.barChart.chartOptions.xAxis.categories=deviceNameList;
      this.barChart.chartOptions.subtitle.text="最後更新時間: "+time;
      this.updateFlag=true;
    })
  }

}
