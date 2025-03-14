import { Component, Input, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { DashboardService } from '../service/dashboard.service';
import * as Highcharts from 'highcharts';
import HC_3D from 'highcharts/highcharts-3d';
import Cylinder from 'highcharts/modules/cylinder';
import HC_exporting from 'highcharts/modules/exporting';
import HC_exportData from 'highcharts/modules/export-data';
import more from 'highcharts/highcharts-more';
import HC_NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';

HC_NoDataToDisplay(Highcharts)
NoDataToDisplay(Highcharts);
HC_exporting(Highcharts);
HC_exportData(Highcharts);

@Component({
  selector: 'app-cust-details',
  templateUrl: './cust-details.component.html',
  styleUrls: ['./cust-details.component.css']
})
export class CustDetailsComponent implements OnInit {
  @Input() custData: any;

  Highcharts = Highcharts;
    CustchartOptions: any;
    colorArray = [ '#FDC6C6','#FD6363','#FDD7C6','#fab1b1']
    vendor: any; 
    selectedWeek: any;
  chartInstance: any;
  chart: any;


  constructor(private service: DashboardService)
  {

    this.initializeChart();

    // this.CustchartOptions = {
    //   chart: {
    //     type: 'pie',
    //     height: 300,
    //     width: 380,
    //     events: {
    //       load: () => {
    //         this.chartInstance = this.chart.chart; // Store the chart instance
    //       },
    //     }
    //   },
    //   title: {
    //     text: ''
    //   },
    //   tooltip: {
    //     headerFormat: '<b>{point.key}</b><br>',
    //   }, 
    //   plotOptions: {
    //     pie: {
    //       allowPointSelect: true,
    //       cursor: 'pointer',
    //       innerSize: 65,
    //       depth: 35,
    //       dataLabels: {
    //         enabled: false,
    //         format: '<b>{point.name}:</b> <span style="opacity: 0.5; color: red">' + '{y}</span>',
    //         connectorColor: '#da2020',
    //         style: {
    //           fontFamily: 'Lexend',
    //           fontSize: '14px',
    //         }
    //       },
         
    //     },
    //   },
    //   credits: {
    //     enabled: false
    //   },
    // };
  }

  initializeChart() {
    this.CustchartOptions = {
      chart: {
        type: 'pie',
        height: 400
      },
      title: {
        text: ''
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          },
          showInLegend: true,
          // events: {
          //   legendItemClick: function (event: any) {
          //     const series = this as unknown as Highcharts.Series; // Series that was clicked
          //     const seriesIndex = series.index; // Index of the clicked series
          //     const seriesCount = series.chart.series.length; // Total number of series in the chart
  
          //     // Check if the clicked item is the last series in the chart
          //     if (seriesIndex === seriesCount - 1) {
          //       const visibleSeriesCount = series.chart.series.filter(s => s.visible).length;
  
          //       // If the last series is visible and it's the only visible one, prevent hiding it
          //       if (visibleSeriesCount === 1 && series.visible) {
          //         event.preventDefault(); // Prevent hiding the last visible series
          //         alert('The last series cannot be hidden!');
          //       }
          //     }
          //   }
          // },
        }
      },
      series: [
       
      ],
      credits: {
        enabled: false
      }
    };
  }

  ngOnInit(): void {
    Cylinder(Highcharts);
    HC_3D(Highcharts);
    more(Highcharts);
    
    HC_NoDataToDisplay(Highcharts)
    NoDataToDisplay(Highcharts);
  }

  ngOnChanges(){
    this.vendor = this.custData;
    this.updateChart();
  }
 
  transformData(data: any[]): [string, number][] {
    return data.map((item: any) => [item.vendor_name, item.category_count]);
  }
 
  updateChart(): void {
    const transformedData = this.transformData(this.vendor);
    
    const one = [{
        colors: this.colorArray,
        name: 'Count',
        sliced: true,
        data: transformedData,
        
      }];

    
    this.CustchartOptions = {
      chart: {
        type: 'pie',
        height: 300,
        width: 380
      },
    
      title: {
        text: ''
      },
      tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
      }, 
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          innerSize: '50%',
          depth: 35,
          dataLabels: {
            enabled: false,
            format: '<b>{point.name}:</b> <span style="opacity: 0.5; color: red">' + '{y}</span>',
            connectorColor: '#da2020'
          },
          
          borderWidth: 2, 
          borderColor: '#ffffff',
          showInLegend: true
        },
      },
      credits: { enabled: false },
      series: one,
    };

  }

  // createChart() {
  //   // this.service.postdata('overview/vendordetails').subscribe(res => {
  //     this.vendor = this.custData;

  //     let series = [];
  //     let categories = [];
  //     // let descriptions = [];

  //     for (let i of this.vendor) {
  //       series.push(i.category_count);
  //       categories.push(i.vendor_name);
  //       // descriptions.push(i.description); 
  //     }

  //     const backgroundColors = [
  //       '#FDC6C6',
  //       '#FD6363',
  //       '#FDD7C6',
  //       '#fab1b1'
  //     ];

  //     if (this.chart) {
  //       this.chart.destroy();
  //     }

  //     // Create the new chart
  //     this.chart = new Chart("MyChart", {
  //       type: 'doughnut',
  //       data: {
  //         datasets: [{
  //           label: '',
  //           data: series,
  //           backgroundColor: backgroundColors,
  //           hoverOffset: 2,
  //           borderRadius: 10
  //         }],
  //         labels: categories,
  //       },
  //       options: {
  //         aspectRatio: 0.5,
  //         responsive: true,
  //         plugins: {
  //           legend: {
  //             position: 'bottom',
  //             align: 'start',
  //             display: true,
  //             labels: {
  //               boxWidth: 12,
  //               padding: 5,
  //             },
  //             onClick: (event, legendItem) => {
  //               const datasetIndex = legendItem.datasetIndex;
  //               const currentVisibility = this.chart.isDatasetVisible(datasetIndex);

  //               // Ensure at least one dataset remains visible
  //               const visibleDatasetsCount = this.chart.data.datasets.filter((_: any, index: number) => {
  //                 return this.chart.isDatasetVisible(index);
  //               }).length;

  //               if (visibleDatasetsCount === 1 && currentVisibility) {
  //                 alert('At least one series should remain visible!');
  //               } else {
  //                 // Toggle visibility of the dataset
  //                 this.chart.toggleDataVisibility(datasetIndex);
  //                 this.chart.update();
  //               }

  //               // Check if all datasets are hidden
  //               const allHidden = this.chart.data.datasets.every((_: any, index: number) => {
  //                 return !this.chart.isDatasetVisible(index);
  //               });

  //               // If all datasets are hidden, show the "No Data Available" message
  //               this.noDataAvailable = allHidden;
  //             }
  //           },
  //           title: {
  //             display: true,
  //             text: 'Customer Details',
  //             position: 'top',
  //             align: 'center',
  //             padding: {
  //               top: 28,
  //               // bottom: 20
  //             },
  //             font: {
  //               size: 16,
  //               // weight: 'bold',
  //               family: 'Lexend'
  //             },
  //             color: '#000'
  //           },
  //         }
  //       }
  //     });
  //   // });
  // }
}
