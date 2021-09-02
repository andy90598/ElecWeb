import { SignalRService } from './../../services/signal-r.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  aa=new Date().getFullYear().toString()+'-'+new Date().getMonth().toString()+'-'+new Date().getDate().toString();
  constructor(
    private signalRService:SignalRService,
    private fb:FormBuilder
  ) {}

  selectForm = this.fb.group({
    dateTime:[Date]
  })

  ngOnInit(): void {
    this.signalRService.show=false
    console.log(this.aa)
  }
  SelectDate(){
    console.log(this.aa)
  }

}
