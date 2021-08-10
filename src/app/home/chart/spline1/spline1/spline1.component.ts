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
      text: '近24小時用電量'
    },
    subtitle:{
      text: '每小時/千瓦'
    },
    plotOptions: {
      spline: {
        dataLabels: {
            enabled: false
        },
      }
    },
    xAxis: {
      title: {
        text: '日期/時間'
      },
      type: 'datetime',
      tickInterval:3600 * 1000,
    },
    yAxis: {
      title: {
        text: '千瓦'
      }
    },
    legend: {
      enabled: true,
    },
    series: [
      {
        type: 'spline',
        name: '冷氣',
        data: new Array
      },
      {
        type: 'spline',
        name: '機台',
        data: new Array
      }
    ]
  } as any
  updateFlag=false;

  constructor(
    public signalRService:SignalRService
  ) { }

  ngOnInit(): void {
    this.signalRService.$dataSpline.subscribe(x=>{
      this.updateFlag=true
      const dataList1=new Array
      const dataList2=new Array
      x=x.slice(1)
      x.reverse().forEach((y,index)=>{
        if(index % 2 ==0){
          dataList1.push({
            x: Date.parse(y.time+'+00:00'),
            y: y.SUM*110/1000
         });
        }else{
          dataList2.push({
            x: Date.parse(y.time+'+00:00'),
            y: y.SUM*110/1000
         });
        }
      })
      this.options.series[0].data=dataList1.slice(0,24).reverse()
      this.options.series[1].data=dataList2.slice(0,24).reverse()
    })
  }
}
