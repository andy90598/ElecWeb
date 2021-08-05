
import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Options } from 'highcharts';



@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  highchart = Highcharts;
  timerId : any;
  options:Options = {
    chart: {
      type: 'spline',
      marginRight: 10,
      events: {
        load:  () =>{
          var series = this.highchart.charts[this.highchart.charts.length-1]?.series[0]
          this.timerId = setInterval(function () {
            var x = (new Date()).getTime(), // 当前时间
              y = Math.random();        // 随机值
              console.log('im back');
            series?.addPoint([x, y], true, true);
          }, 5000);
        }
      }
    },
    title: {
      text: '动态模拟实时数据'
    },
    xAxis: {
      type: 'datetime',
      tickPixelInterval: 150
    },
    yAxis: {
      title: {
        text: null
      }
    },
    tooltip: {
      formatter: function () {
        return '<b>' + this.series.name + '</b><br/>' +
          Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
          Highcharts.numberFormat(this.y, 2);
      }
    },
    legend: {
      enabled: false
    },
    series: [{
      type: 'spline',
      name: '随机数据',
      data: (function () {
        // 生成随机值
        var data = [], time = (new Date()).getTime(), i;
        for (i = -19; i <= 0; i += 1) {
          data.push({
            x: time + i * 1000,
            y: Math.random()
          });
        }
        console.log(data);
        return data;
      }())
    }]
  }


  constructor() { }

  ngOnInit(): void {
    console.log('NGONINIT');
  }


  destroy(){
    if(this.timerId){
      clearInterval(this.timerId);
      console.log('NGONDESTROY');
    }
  }
  ngOnDestroy(): void {
    if(this.timerId){
      clearInterval(this.timerId);
      console.log('NGONDESTROY');
    }
  }
}
function activeLastPointToolip(chart: Highcharts.Chart) {
  var points = chart.series[0].points;
  chart.tooltip.refresh(points[points.length - 1]);
}


