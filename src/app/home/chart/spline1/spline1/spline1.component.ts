import { Subscription } from 'rxjs';
import { HomeService } from './../../../home.service';
import { Component, OnInit } from '@angular/core';
import { SignalRService } from 'src/app/services/signal-r.service';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-spline1',
  templateUrl: './spline1.component.html',
  styleUrls: ['./spline1.component.css']
})
export class Spline1Component implements OnInit {

  chartList = new Array();

  options={
    chart: {
      type: 'spline',
      marginRight: 10,
    },
    title: {
      text: '今日每小時用電量',
      style:{
        fontSize:'24px'
      }
    },
    subtitle:{
      text: ''
    },
    plotOptions: {
      spline: {
        dataLabels: {
            enabled: false
        }
      },
      series: {
        marker: {
            enabled: true
        }
      }
    },
    xAxis: {
      title: {
        text: '日期/時間'
      },
      type: 'datetime',
      tickInterval:3600 * 1000,
      min:new Date
    },
    yAxis: {
      title: {
        text: '千瓦'
      }
    },
    legend: {
      enabled: true,
    },
    series:[

    ]
  }as any
  chart=new Chart();
  //宣告一個名為subscription的變數 型別是Subscription = new Subscription()
  private subscription:Subscription =new Subscription();

  today = new Date();
  constructor(
    public signalRService:SignalRService,
    public homeService:HomeService
  ) {
    this.chart=new Chart(this.options)
  }

  ngOnInit(): void {
    // this.CreatDataList();
    this.GetInit();
  }
  GetInit(){
    // setTimeout(()=>{this.signalRService.show=true;},0);
    this.signalRService.show=true;

    this.subscription.add(
      this.signalRService.$dataSpline.subscribe(x=>{
        this.CreatDataList()
        // console.log(x)
        if(this.signalRService.splineTempLength>0){
          this.signalRService.show=false;
        }
        this.today = new Date();

        this.options.subtitle.text='最後更新時間:'+this.today.toLocaleString()
        // 取得今天0時作為x軸的起始點

        this.options.xAxis.min=
            Date.parse(
            new Date(this.today.getFullYear(),
            this.today.getMonth(),
            this.today.getDate(),0,0,0).toString()+'+00:00')

        x.forEach((z)=>{
          // y是chartList z是hourdata
          // 如果chartList的name==hourData的name 則 push data
          //每小時資料
          if(x.length>0){
            this.chartList.find(y=>y.name == z.name)?.data.push({x:Date.parse(z.time+'+00:00'),y:z.sum*z.volt/1000});
          }
        })
        // 塞data到series的data
        // console.log('list = ',this.chartList)
        this.options.series=JSON.parse(JSON.stringify(this.chartList));
        // this.chart = new Chart(this.options);
        this.chart.ref?.update(this.options,true,true,true);
        // console.log(this.chart.ref?.series);
      })
    );
  }
  // 創陣列符合spline圖表 series的格式 {type:'spline',name:this.nameList[i],data:[]}
  // data之後再GetOnIt塞
  CreatDataList(){
    this.chartList=new Array();
      for(let i=0;i<this.signalRService.DeviceNameList.length;i++){
        this.chartList.push({type:'spline',name:this.signalRService.DeviceNameList[i].name,data:[]});
      }
    // console.log(this.chartList)
  }
  ngOnDestroy(): void {
    //取消訂閱
    this.subscription.unsubscribe();
  }
}
