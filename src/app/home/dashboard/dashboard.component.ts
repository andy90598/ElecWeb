import { AccumulationElec } from './../../Models/AccumulationElec';
import { SignalRService } from './../../services/signal-r.service';
import { Chart } from 'angular-highcharts';
import { DonutChart } from './../../Models/DonutChart';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ElecData } from 'src/app/Models/ElecData';
import { ElecRowData } from 'src/app/Models/ElecRowData';
import { HttpService } from 'src/app/services/http.service';
import { Options } from 'highcharts';
import { SplineChart } from 'src/app/Models/SplineChart';
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
  splinechart = new Chart();

  highChart=Highcharts;
  chartOptions = Highcharts.setOptions({
    chart:{
      spacing : [0, 0 , 0, 0], //margin 上左下右

      events: {
        load: function () {
        var series = this.series[0],
            chart = this;
        // activeLastPointToolip(chart);
          setInterval(function () {
          // activeLastPointToolip(chart);
        }, 1000);
      }
      }
    },
    title:{
      text:"用電比例",
      align:'center',
      y:25,
      style:{
        fontSize:'2em'
      }
    },
    //商標
    credits:{
      enabled:false
    },
    //滑鼠移上去時顯示的文字方塊
    tooltip:{
      pointFormat:'{series.name}: <b>{point.y:.1f}A</b>'
    },
    // 针对不同类型图表的配置
    legend:{
      align:'center',
      verticalAlign:'top',
      margin:0,
      reversed:true
    },
    plotOptions: {
      pie: {
        showInLegend: true,
        allowPointSelect: true, //可被選取
        cursor: 'pointer', //指標變滑鼠
        dataLabels: {
          enabled: true,
          distance:'-30%',
          // format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          format: '{point.percentage:.1f} %',
          style: {
            color: 'black',
            fontSize:'18px'
          }
        },
      },
    },
    // 数据列，图表上一个或多个数据系列
    series:[{
      size: '80%',
      name: '比例',
      innerSize:'60%',
      type:"pie",
      data: [
        ["AAA",123],
        ["BBB",456]
      ]
    }]
  });

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
      let options2=new SplineChart();
      const accumulationElecList=new Array;
      let time=""
      x.forEach(y=>{
        accumulationElecList.push(Math.round(y.value*110))
        time=y.time
      })
      options2.options.subtitle.text+=time
      Array.prototype.push.apply(options2.options.series[0].data,accumulationElecList)
      this.splinechart=new Chart(options2.options as Options)
      // console.log(this.splinechart)
    })

    this.id=setInterval(()=>{
      console.log('aaa')
      this.GetInit();
    },1000)
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
