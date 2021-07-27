import { deviceenums } from './../../Models/Enums';
import { PieChart } from './../../Models/PieChart';
import { PieDataService } from './../../services/pie-data.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ElecData } from 'src/app/Models/ElecData';
import { ElecRowData } from 'src/app/Models/ElecRowData';
import { HttpService } from 'src/app/services/http.service';
import { StringOption } from 'src/app/Models/Options';
import * as D3 from 'd3';

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
  //圓餅圖表
  pie: PieChart = new PieChart;
  //控制 setInterval()生命週期
  id:any



  deviceName=new Map([
    [1,"空調"],
    [2,"機台"],
  ]);

  elecDeviceList:StringOption[]=[]

  constructor(
    private httpService:HttpService,
    private pieDataService:PieDataService
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
      // console.log('this.elecRowDataList',this.elecRowDataList)
    })
  }
  GetData(){
    let sum=0
    this.elecDeviceList = []
    this.httpService.get("http://192.168.140.80:9210/list").subscribe(x=>{
      this.elecDataList=x

      ///以下做PIE CHART用到的資料
      this.elecDataList.forEach(x=>{
        sum+=x.value
      })
      sum+=1
      console.log(sum)
      this.elecDataList.forEach((x,index)=>{
        const elecDevice = new StringOption
        elecDevice.label=this.deviceName.get(index) as string
        elecDevice.value=Math.round((x.value/sum*100)*100)/100
        this.elecDeviceList.push(elecDevice)
      })
      // console.log('this.elecDeviceList',this.elecDeviceList)
      this.elecDeviceList=this.elecDeviceList.slice(1)
      this.pieDataService.setData(this.elecDeviceList)
    })

  }

  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }
  }

  ngAfterViewInit(){
    this.pie.htmlElement = this.element.nativeElement;
    this.pie.host = D3.select(this.pie.htmlElement);
    this.pieDataService.$data.subscribe(data=>{
      this.pie.pieData = data;
      this.setup();
      this.bulidSVG();
      this.buildPie();
    })
  }

  private setup():void{
    //設半徑 長寬
    this.pie.width = 200;
    this.pie.height = 200;
    this.pie.radius = Math.min(this.pie.width,this.pie.height)/4;
  }
  private bulidSVG():void{
    //設定大小及定位
    this.pie.host.html("");
    this.pie.svg = this.pie.host.append("svg")
      .attr("viewBox",`0 0 ${this.pie.width} ${this.pie.height}`)
      .append("g")
      .attr("transform",`translate(${this.pie.width/2},${this.pie.height/2})`);
  }
  private buildPie():void{
    let newpie = D3.pie(); //create pie
    let values = this.pie.pieData.map(data=>data.value);
    let arcSelection = this.pie.svg.selectAll(".arc")
      .data(newpie(values))
      .enter()
      .append("g")
      .attr("class","arc");
    this.populatePie(arcSelection)
  }

  private populatePie(arcSelection:any):void{
    let innerRadius = this.pie.radius-20;
    let outterRadius = this.pie.radius;
    let pieColor = D3.scaleOrdinal(D3.schemeCategory10);
    let arc = D3.arc().innerRadius(innerRadius).outerRadius(outterRadius);
    //Draw arc paths

    arcSelection.append("path")
      .attr("d",arc)
      .attr("fill",(datum: any,index:number)=>{
        return pieColor(this.pie.pieData[index].label)
      })
      .text((datum:any,index:number)=>this.pie.pieData[index].label)
      .style("text-anchor","middle");

    arcSelection.append("text")
      .attr("transform",(datum:any)=>{
        datum.innerRadius = 0;
        datum.outerRadius = this.pie.radius;
        return "translate(" + arc.centroid(datum) +")";
      })
      .text((datum:any,index:number)=>this.pie.pieData[index].value+'%')
      .style("text-anchor","middle");
  }


}
