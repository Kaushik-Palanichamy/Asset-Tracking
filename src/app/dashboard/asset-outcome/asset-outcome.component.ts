import { Component, ViewChild } from '@angular/core';
import { ApexGrid, NgApexchartsModule } from "ng-apexcharts";
import {
  ChartComponent,
  ApexChart,
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip,
  ApexMarkers,
  ApexAnnotations,
  ApexStroke
} from "ng-apexcharts";
import {data} from './series-data';
import { DashboardService } from '../service/dashboard.service';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  grid: ApexGrid;
  annotations: ApexAnnotations;
  colors: any;
  toolbar: any;
};

// type UpdateOption = "1m" | "6m" | "1y" | "1yd" | "all";

@Component({
  selector: 'app-asset-outcome',
  templateUrl: './asset-outcome.component.html',
  styleUrls: ['./asset-outcome.component.css']
})
export class AssetOutcomeComponent {
  @ViewChild("chart", { static: false })
  chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  date=new Date()
  pipe= new DatePipe("en-US")

  minDate: Date;
  maxDate: Date;

  // public activeOptionButton = "all";
  // public updateOptionsData = {
  //   "1m": {
  //     xaxis: {
  //       min: new Date("28 Jan 2013").getTime(),
  //       max: new Date("27 Feb 2013").getTime()
  //     }
  //   },
  //   "6m": {
  //     xaxis: {
  //       min: new Date("27 Sep 2012").getTime(),
  //       max: new Date("27 Feb 2013").getTime()
  //     }
  //   },
  //   "1y": {
  //     xaxis: {
  //       min: new Date("27 Feb 2012").getTime(),
  //       max: new Date("27 Feb 2013").getTime()
  //     }
  //   },
  //   "1yd": {
  //     xaxis: {
  //       min: new Date("01 Jan 2013").getTime(),
  //       max: new Date("27 Feb 2013").getTime()
  //     }
  //   },
  //   all: {
  //     xaxis: {
  //       min: undefined,
  //       max: undefined
  //     }
  //   }
  // };

  apiData: any;

  constructor(private service:DashboardService) {

    this.minDate = new Date(2018, 0, 1);

    const currentYear = new Date().getFullYear();
    this.maxDate = new Date(currentYear, 11, 31);

    // this.chartOptions = {
    //   series: [],
    //   chart: {
    //     type: "area",
    //     height: 300,
    //     toolbar: {
    //       show: false,
    //     }
    //   },
    //   xaxis:{
    //    categories: [] ,
    //   },
    //   annotations: {
    //     yaxis: [
    //       {

    //         label: {

    //           style: {
    //             color: "#fff",
    //             background: "#00E396"
    //           }
    //         }
    //       }
    //     ],
    //     xaxis:[
    //     {

    //     label: {

    //             style: {
    //               color: "#fff",
    //               background: "#775DD0"
    //             }
    //           }
    //         }
    //     ]
    //   },
    //   dataLabels: {
    //     enabled: false
    //   },
    //   markers: {
    //     size: 0
    //   },

    //   tooltip: {

    //   },
    //   fill: {
    //     type: "gradient",
    //     gradient: {
    //       shadeIntensity: 1,
    //       opacityFrom: 0.7,
    //       opacityTo: 0.9,
    //       stops: [0, 100]
    //     }
    //   }
    // };

    this.initChart();
  }

  loadingicon:boolean=true;

  initChart(): void {

    const now = new Date();
    const currYear =  now.getFullYear();
    let events =  {year: currYear }
    // console.log("curr",events)
    this.service.postData('virtualreport/outwards',events).subscribe(res =>{
      this.loadingicon = false
      this.apiData = res


   let data = this.apiData
   let len = data.length
  //  console.log(data)
   let labelArray: any=[];
   let outArray=[];

   for(let i=0; i<len; i++){
       labelArray.push(data[i].month)
       outArray.push(data[i].outwards)
   }
// console.log(outArray)

    this.chartOptions = {
      series: [{
        name:'Count:',
        data: outArray,
        color: '#f76c6c',
      }],


      chart: {
        type: "area",
        height: 300,
        toolbar: {
          show: false,
        }
      },
      xaxis:{
       categories: labelArray ,
       labels: {
        style: {
          fontFamily: 'Lexend', 
          fontSize: '12px',
        
        }
      }
      
      },
      yaxis: {
        labels: {
          style: {
            fontFamily: 'Lexend', 
            fontSize: '12px',   
          }
        }
      },
      annotations: {
        yaxis: [
          {

            label: {

              style: {
                color: "#fff",
                background: "#00E396"
              }
            }
          }
        ],
        xaxis:[
        {

        label: {

                style: {
                  color: "#fff",
                  background: "#775DD0"
                }
              }
            }
        ]
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 0
      },

      tooltip: {

      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100]
        }
      }
    };
  })
  }

  changeYear(event: any){

    let events =  {year: this.pipe.transform(event,"yyyy")}
    // console.log("Date",events)
    this.loadingicon = true
    this.service.postData('virtualreport/outwards',events).subscribe(res =>{
      this.loadingicon = false
      this.apiData = res


   let data = this.apiData
   let len = data.length
  //  console.log(data)
   let labelArray: any=[];
   let outArray=[];

   for(let i=0; i<len; i++){
       labelArray.push(data[i].month)
       outArray.push(data[i].outwards)
   }
// console.log(outArray)

    this.chartOptions = {
      series: [{
        name:'Count:',
        data: outArray,
        color: '#f76c6c',
      }],


      chart: {
        type: "area",
        height: 300,
        toolbar: {
          show: false,
        }
      },
      xaxis:{
       categories: labelArray ,
      },
      annotations: {
        yaxis: [
          {

            label: {

              style: {
                color: "#fff",
                background: "#00E396"
              }
            }
          }
        ],
        xaxis:[
        {

        label: {

                style: {
                  color: "#fff",
                  background: "#775DD0"
                }
              }
            }
        ]
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 0
      },

      tooltip: {

      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100]
        }
      }
    };
  })

  }
}
