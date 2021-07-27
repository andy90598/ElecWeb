import { PieDataService } from './../services/pie-data.service';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GaugesModule} from '@biacsics/ng-canvas-gauges';
import { HomeRoutingModule } from './home-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartComponent } from './chart/chart.component';
import { ChartModule } from 'angular-highcharts';


@NgModule({
  declarations: [
    DashboardComponent,
    ChartComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    GaugesModule,
    ChartModule
  ],
  providers:[PieDataService],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]

})
export class HomeModule { }
