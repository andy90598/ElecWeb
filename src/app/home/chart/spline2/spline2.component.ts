import { SplineData } from './../../../Models/SpLineData';
import { Component, OnInit } from '@angular/core';
import { now } from 'd3';
import * as Highcharts from 'highcharts';
import { SignalRService } from 'src/app/services/signal-r.service';

@Component({
  selector: 'app-spline2',
  templateUrl: './spline2.component.html',
  styleUrls: ['./spline2.component.css']
})
export class Spline2Component implements OnInit {
  aa:any
  highchart = Highcharts;
  timerId : any;
  options={
    chart: {
      type: 'column'
    },
    title: {
        text: '每月用電量'
    },
    // subtitle: {
    //     text: 'Source: WorldClimate.com'
    // },
    xAxis: {
        categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ],
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: '千瓦'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.3f} kWh</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series:[
      {
        name: 'Tokyo',
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
      }, {
          name: 'New York',
          data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

      }, {
          name: 'London',
          data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]

      }, {
          name: 'Berlin',
          data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]

      }
    ]
  }  as any
  updateFlag=false;


  constructor(
    public signalRService:SignalRService
  ) { }

  ngOnInit(): void {
    this.signalRService.StartConnection()
    this.signalRService.addTransferBroadcastDataListener()
    this.signalRService.$dataMonth.subscribe(x=>{
      this.updateFlag=true
      const dataList1= {name:'',data:new Array(12).fill(0)};
      const dataList2= {name:'',data:new Array(12).fill(0)};
      x.forEach((x)=>{
        if(x.uuid == '0081F924C0C6'){
          dataList1.name='0081F924C0C6';
          dataList1.data[x.time-1]=Math.round((x.SUM*110/1000)*1000)/1000;
        }
        if(x.uuid == '0081F9254F0F'){
          dataList2.name='0081F9254F0F';
          dataList2.data[x.time-1]=Math.round((x.SUM*110/1000)*1000)/1000;
        }
      });
      this.options.series=[dataList1,dataList2];
    })
  }

}
