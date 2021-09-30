import { HttpService } from './../../services/http.service';
import { SignalRService } from './../../services/signal-r.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  selectForm!:FormGroup;
  searchData =new Array<{name:"",time:"",uuid:"",value:0}>();
  submitted =false;
  constructor(
    public signalRService:SignalRService,
    private fb:FormBuilder,
    private httpService:HttpService
  ) {}

  ngOnInit(): void {
    // setInterval(()=>this.signalRService.show=false,0);
    this.signalRService.show=false;
    this.signalRService.DeviceNameList;
    this.selectForm = this.fb.group({
      id:["",Validators.required],
      start:[""],
      end:[""],
    });
  }

  Submit(){
    this.submitted = true;
    //找出哪個欄位不符合規定
    this.findInvalidControls()
    //不符合格式無法送出
    if(this.selectForm.invalid){
      alert("資料填寫不齊全 \n"+this.findInvalidControls()+"\n"+"未填寫")
      return;
    }

    //這段做要送出的url
    let id = this.selectForm.get("id")?.value as string;
    let start = this.selectForm.get("start")?.value;
    let startDate = start.year+'-'+(start.month)+'-'+start.day;
    // let startDate = new Date(start.year,start.month-1,start.day,0,0,0,0).toLocaleString();
    let end = this.selectForm.get("end")?.value;
    let endDate = end.year+'-'+(end.month)+'-'+end.day;
    let url = 'api/Todo/'+id+'/'+startDate+'/'+endDate
    // console.log(url)

    //送出資料並取得資料
    this.httpService.get(url).subscribe(x=>{
      // console.log(x)
      if(x.status == 200){
        this.searchData = x.body;
      }else{
        this.searchData=new Array() ;
        alert("錯誤代碼 : "+x.status+'\n'+"錯誤訊息 : "+x.statusText+" "+x.error);
      }
    })

  }
  //找出哪個欄位不符合規定
  findInvalidControls():Array<any>{
    const invalid = [];
    const controls = this.selectForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    // console.log(invalid)
    return invalid.length>0? invalid:[]
  }

  Reset(){
    this.submitted = false;
    this.searchData.length=0;
    this.selectForm.reset(
      this.selectForm=this.fb.group({
        id:[""],
        start:[""],
        end:[""],
      }));
  }
}
