import { SignalRService } from 'src/app/services/signal-r.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  constructor(
    private signalRService:SignalRService
  ) { }
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.signalRService.show=false
  }
}


