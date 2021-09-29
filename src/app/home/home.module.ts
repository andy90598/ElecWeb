
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GaugesModule } from '@biacsics/ng-canvas-gauges';
import { HomeRoutingModule } from './home-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartComponent } from './chart/chart.component';
import { ChartModule } from 'angular-highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { Spline1Component } from './chart/spline1/spline1/spline1.component';
import { Spline2Component } from './chart/spline2/spline2.component';
import { SearchComponent } from './search/search.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgbModule,NgbDate } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    DashboardComponent,
    ChartComponent,
    Spline1Component,
    Spline2Component,
    SearchComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    GaugesModule,
    ChartModule,
    HighchartsChartModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    // NgbDate
  ],
  providers:[],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]

})
export class HomeModule { }
