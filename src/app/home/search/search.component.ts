import { HttpService } from './../../services/http.service';
import { HttpClient } from '@angular/common/http';
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
  submitted =false;
  constructor(
    public signalRService:SignalRService,
    private fb:FormBuilder,
    private httpService:HttpService
  ) {}

  ngOnInit(): void {
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
    this.findInvalidControls()
    if(this.selectForm.invalid){
      console.log('AAA')
      return;
    }
    let id = this.selectForm.get("id")?.value as string;
    let start = this.selectForm.get("start")?.value;
    let startDate = start.year+'-'+(start.month)+'-'+start.day;
    // let startDate = new Date(start.year,start.month-1,start.day,0,0,0,0).toLocaleString();
    let end = this.selectForm.get("end")?.value;
    let endDate = end.year+'-'+(end.month)+'-'+end.day;
    let url = '/Todo/'+id+'/'+startDate+'/'+endDate
    console.log(url);
    this.httpService.get(url).subscribe(x=>{
      console.log(x);
    })

  }

  findInvalidControls() {
    const invalid = [];
    const controls = this.selectForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    console.log(invalid);
  }

  Reset(){
    this.submitted = false;
    this.selectForm.reset(
      this.selectForm=this.fb.group({
        id:[""],
        start:[""],
        end:[""],
      }));
  }
}
