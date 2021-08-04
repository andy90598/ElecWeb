import { Chart } from 'angular-highcharts';
import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { interval } from 'rxjs';
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
          var series = this.highchart.charts[this.highchart.charts.length-1]?.series[0],
            chart = this;
          this.timerId = setInterval(function () {
            var x = (new Date()).getTime(), // 当前时间
              y = Math.random();          // 随机值
            console.log('chart1', y);
            series?.addPoint([x, y], true, true);
            console.log(series)
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

  chartOptios = this.highchart.setOptions(this.options)
  constructor() { }
  ngOnInit(): void {

    console.log('NGONINIT');
  }

  ngOnDestroy(): void {
    if(this.timerId){
      clearInterval(this.timerId);
    }
    console.log('NGONDESTROY');
  }
}
function activeLastPointToolip(chart: Highcharts.Chart) {
  var points = chart.series[0].points;
  chart.tooltip.refresh(points[points.length - 1]);
}


