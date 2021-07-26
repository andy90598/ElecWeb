import { PieDataService } from './../services/pie-data.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GaugesModule} from '@biacsics/ng-canvas-gauges';
import { HomeRoutingModule } from './home-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartComponent } from './chart/chart.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ChartComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    GaugesModule,
  ],
  providers:[PieDataService],
})
export class HomeModule { }
