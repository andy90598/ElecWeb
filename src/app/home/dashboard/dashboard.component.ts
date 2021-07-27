import { Chart } from 'angular-highcharts';
import { DonutChart } from './../../Models/DonutChart';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ElecData } from 'src/app/Models/ElecData';
import { ElecRowData } from 'src/app/Models/ElecRowData';
import { HttpService } from 'src/app/services/http.service';
import { Options } from 'highcharts';






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
  chart=new Chart()


  constructor(
    private httpService:HttpService,
  ) { }

  ngOnInit(): void {
    this.GetInit();
    this.id=setInterval(()=>{
      this.GetInit();
    },10000)
  }
  GetInit(){
    this. GetRowData();
    this. GetData();
  }

  GetRowData(){
    this.httpService.get("http://192.168.140.80:9100/list").subscribe(x=>{
      this.elecRowDataList=x
      console.log('this.elecRowDataList',this.elecRowDataList)
    })
  }
  GetData(){
    let options = new DonutChart();
    let elecDeviceList=new Array();
    this.httpService.get("http://192.168.140.80:9210/list").subscribe(x=>{
      this.elecDataList=x;
      this.elecDataList.forEach(x=>{
        const elecDevice = new Array<string|number>();
        elecDevice[0]=x.uuid;
        elecDevice[1]=x.value;
        console.log(elecDevice)
        elecDeviceList.push(elecDevice)
      })
      elecDeviceList = elecDeviceList.slice(1)
      console.log(elecDeviceList)
      Array.prototype.push.apply(options.options.series[0].data,elecDeviceList)

      this.chart=new Chart(options.options as Options)
      console.log(this.chart)
    })

  }

  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }
  }

}
