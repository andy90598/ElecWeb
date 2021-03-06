import { AccumulationElec } from './../../Models/AccumulationElec';
import { HomeService } from './../home.service';
import { SignalRService } from './../../services/signal-r.service';
import { DonutChart } from './../../Models/DonutChart';
import {  ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ElecRowData } from 'src/app/Models/ElecRowData';
import { BarChart } from 'src/app/Models/BarChart';
import * as Highcharts from 'highcharts';
import { Subscription } from 'rxjs';
import { Chart } from 'angular-highcharts';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  @ViewChild("Ac_Server") element!: ElementRef;
  //從樹梅派撈到的資料
  elecRowDataList: Array<ElecRowData> = [];
  //從樹梅派撈到的資料
  elecDataList: Array<AccumulationElec> = [];
  //控制 setInterval()生命週期
  id: any
  //設備名稱表
  //圓餅圖
  donutchart = new DonutChart;
  //長方圖
  barChart = new BarChart;
  //圖表是否更新
  updateFlag = false;
  //圖表套件
  Highcharts = Highcharts;
  //圖表套件
  chartConstructor = "chart";
  chartForBar = new Chart(this.barChart.chartOptions);
  chartForPie = new Chart(this.donutchart.options);

  private subscription: Subscription = new Subscription();

  constructor(
    public signalRService: SignalRService,
    public homeService: HomeService,
    private cd:ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // 一開始近來顯示loading
    this.signalRService.show = true;
    this.subscription.add(
      this.signalRService.$dataNow.subscribe(x => {

        if (x.length > 0) {
          //有資料後把loading關閉
          this.signalRService.show = false;
          this.cd.detectChanges()
        }
        let elecDeviceList = new Array();
        // 讓elecDataList = 訂閱收到的值
        this.elecDataList = x
        // 跑回圈 把elecDevice塞到elecDeviceList <name|value>
        this.elecDataList.forEach((x, index) => {

          x.value==-1? 0:x.value;
          const elecDevice = new Array<string | number>();
          if (x.name != null)
          {
            elecDevice[0] = x.name;
          } else
          {
            elecDevice[0] = '';
          }


          elecDevice[1] = x.value*x.volt;
          elecDeviceList.push(elecDevice)
        })
        // 陣列合併 把 elecDeviceList 第一筆去掉後塞到 options.options.series[0].data 裡
        this.donutchart.options.series[0].data = elecDeviceList;
        this.chartForPie.ref?.update(this.donutchart.options);

        //長條圖
        const accumulationElecList = new Array
        const deviceNameList = new Array
        x.forEach(y => {
          deviceNameList.push(y.name);

          accumulationElecList.push(Math.round(y.value * y.volt))
        })
        this.barChart.chartOptions.series[0].data = accumulationElecList;
        this.barChart.chartOptions.xAxis.categories = deviceNameList;
        this.barChart.chartOptions.subtitle.text = "最後更新時間: " + new Date().toLocaleString();
        this.chartForBar.ref?.update(this.barChart.chartOptions);
        // console.log(this.chartForBar,'<===bar')
        this.updateFlag = true;
      })
    );
    this.GetInit()
  }

  GetInit() {
    // let chartForPie = new Chart(this.donutchart.options);
    //圓餅圖
    //訂閱 signalRService的 $data 當$data變動時收到資料
    this.subscription.add(

      this.signalRService.$dataBar.subscribe(x => {
        // 設備名稱跟值的表
        let elecDeviceList = new Array();
        // 讓elecDataList = 訂閱收到的值
        this.elecDataList = x;
        // 跑回圈 把elecDevice塞到elecDeviceList <name|value>
        this.elecDataList.forEach((x, index) => {
          console.log(x)
          x.value==-1? 0:x.value;
          const elecDevice = new Array<string | number>();
          elecDevice[0] = x.name;
          elecDevice[1] = x.value * x.volt;
          elecDeviceList.push(elecDevice)
        })
        // 陣列合併 把 elecDeviceList 第一筆去掉後塞到 options.options.series[0].data 裡
        this.donutchart.options.series[0].data = elecDeviceList;
        //圖表更新
        this.chartForPie.ref?.update(this.donutchart.options);

        //長條圖----------------------------------------------------------------------------------
        const accumulationElecList = new Array
        const deviceNameList = new Array
        x.forEach(y => {
          accumulationElecList.push(Math.round(y.value * y.volt))
          deviceNameList.push(y.name);
        })

        this.barChart.chartOptions.series[0].data = accumulationElecList;
        this.barChart.chartOptions.xAxis.categories = deviceNameList;
        this.barChart.chartOptions.subtitle.text = "最後更新時間: " + new Date().toLocaleString();
        this.chartForBar.ref?.update(this.barChart.chartOptions);
        // this.updateFlag = true;
      })
    );
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.signalRService.show = false;
    this.subscription.unsubscribe();
  }

}
