import { Component, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_3D from 'highcharts/highcharts-3d';

HC_3D(Highcharts);

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexPlotOptions,
  ApexStates,
  ApexTheme,
  ApexTitleSubtitle,
  ChartComponent
} from "ng-apexcharts";
import { DashboardService } from 'src/app/dashboard/service/dashboard.service';

import { SettingsService } from 'src/app/settings/Add-ons/service/settings.service';


export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: any;
  stroke: ApexStroke;
  states: ApexStates;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  theme: ApexTheme;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-category-chart',
  templateUrl: './category-chart.component.html',
  styleUrls: ['./category-chart.component.scss']
})
export class CategoryChartComponent {
  Highcharts = Highcharts;

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;
  
  chartData: any;

  colorArray = ["#ccebf5","#bfe6f2","#b2e0f0","#a6dbed","#99d6eb",
  "#8cd1e8","#80cce6","#73c7e3","#66c2e0","#59bdde","#4db8db",
  "#40b2d9","#33add6","#26a8d4","#bad1ff","#b2ccff","#abc7ff",
  "#a3c2ff","#9cbdff","#94b8ff","#8cb2ff","#73abe3","#66a3e0",
  
];
  constructor(private service:DashboardService){

  
  this.chartOptions = {
    chart: {
      type: 'column',
      options3d: {  
        enabled: true,
        alpha: 20,
        beta: 0,
        depth: 50,
        viewDistance: 50
      },
      height: 250, 
      width: 450 
    },
   
    title: {
      text: ''
    },
    // legend: {
    //   verticalAlign: 'bottom'
    // },
    xAxis: {
      categories: [],
      labels: {
        skew3d: true,
        style: {
          fontSize: "14px",
          fontFamily: 'SharpSans, sans-serif',
          fontWeight: 'bold'
        }
      }
    },
    plotOptions: {
      column: {
        depth: 60,
        dataLabels :{ 
          enabled: true,
          colors: "#000000",
          style: {
            textOutline: 'none'}
        }
      },
      series: {
        cursor: 'pointer',  
        colorByPoint: true,
      }
    },
    yAxis: {
      title: {
        text: ''
      }
    },
    credits:{
      enabled:false
    },
    series: [],
  }
  this.initializeChart();
  }

  ngOnInIt(){
    
    
  }

  endpoint : any;

  
transformData(): [string, number][] {
  this.service.postdata("overview/categorytotal").subscribe(res=>{
    this.chartData = res.Category_Wise
    // console.log('category',this.chartData)  
  
  });


  const { categoryname, totalcount } = this.chartData;
  return categoryname.map((category:any, index:any) => [category, totalcount[index]]);
}


transformedData: [string, number][] = [];

  initializeChart(){
    
    this.transformedData = this.transformData();
    
 
    let seriesData = [{
      name: "",
      data: this.transformedData
    }]
    // console.log("seriesData",seriesData)

    this.chartOptions = seriesData
    this.chartOptions= { ... this.chartOptions
    
    // this.chartOptions = {
    //   chart: {
    //     type: 'pie',
    //     // height:'265',
    //     options3d: {
    //         enabled: true,
    //         alpha: 45
    //     },
    //     height: 250, 
    //   width: 450
    // },
    // title: {
    //     text: ''
    // },
    // subtitle: {
    //     text: ''
    // },
    // plotOptions: {
    //     pie: {
    //         innerSize: 2,
    //         depth: 15
    //     }
    // },
    // credits:{
    //   enabled:false
    // },
    // series: [{
    //     name: 'Assets',
    //     allowPointSelect: true,
    //     keys: ['name', 'y', 'selected', 'sliced'],
    //     data: this.chartData
    // }] ,
    }
  }
}
