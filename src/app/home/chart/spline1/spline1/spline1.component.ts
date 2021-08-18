import { HomeService } from './../../../home.service';
import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { SignalRService } from 'src/app/services/signal-r.service';

@Component({
  selector: 'app-spline1',
  templateUrl: './spline1.component.html',
  styleUrls: ['./spline1.component.css']
})
export class Spline1Component implements OnInit {
  highchart = Highcharts;
  timerId : any;
  options={
    chart: {
      type: 'spline',
      marginRight: 10,
    },
    title: {
      text: '今日每小時用電量'
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
      min:null as any
    },
    yAxis: {
      title: {
        text: '千瓦'
      }
    },
    legend: {
      enabled: true,
    },
    series: []
  } as any

  updateFlag=false;
  //最後塞到series data的是這個
  chartList = new Array();
  today = new Date();

  constructor(
    public signalRService:SignalRService,
    public homeService:HomeService
  ) {
  }

   ngOnInit(): void {
    this.signalRService.show=true;
    this.CreatDataList();
    this.GetOnInit();
  }
    GetOnInit(){
      this.signalRService.$dataSpline.subscribe(x=>{
        // 關閉loading畫面
        if(x.length!=0){
          this.signalRService.show=false
        }

      this.today = new Date();
      this.options.subtitle.text ='最後更新時間:'+this.today.toLocaleString();
      // 如果(資料筆數 % 設備數量==0) 才更新，因為每個溝表時間不同 每個整點要等資料齊全才能塞到圖表

      x.forEach((z,index)=>{
        this.signalRService.show=false
        // y是chartList z是hourdata
        // 如果chartList的name==hourData的name 則 push data
        this.chartList.find(y=>y.name == z.name).data.push({x:Date.parse(z.time+'+00:00'),y:z.sum})
      })
      // 取得今天0時作為x軸的起始點
      this.options.xAxis.min = Date.parse(new Date(this.today.getFullYear(),this.today.getMonth(),this.today.getDate(),0,0,0).toString()+'+00:00');
      // 塞data到series的data
      this.options.series=this.chartList;
      //更新圖表的series
      this.updateFlag=true;
    })
  }
  // 創陣列符合spline圖表 series的格式 {type:'spline',name:this.nameList[i],data:[]}
  // data之後再GetOnIt塞
  CreatDataList(){
    for(let i=0;i<this.homeService.deviceNameList.length;i++){
      this.chartList.push({type:'spline',name:this.homeService.deviceNameList[i],data:[]});
    }
  }

}
