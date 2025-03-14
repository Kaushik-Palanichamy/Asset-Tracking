import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_3D from 'highcharts/highcharts-3d';
import Cylinder from 'highcharts/modules/cylinder';
import HC_exporting from 'highcharts/modules/exporting';
import HC_exportData from 'highcharts/modules/export-data';
import more from 'highcharts/highcharts-more';
import { AssetsViewService } from 'src/app/dashboard/service/assets-view.service';
 
HC_exporting(Highcharts);
HC_exportData(Highcharts);
 
@Component({
  selector: 'app-status-chart',
  templateUrl: './status-chart.component.html',
  styleUrls: ['./status-chart.component.scss']
})
export class StatusChartComponent implements OnInit {

  Highcharts = Highcharts;
  StatuschartOptions: any;
  statusData: any[] = [];
  colorArray = ['#FABEAF', '#B9A2C4', '#F49096']

  constructor(private service: AssetsViewService) {
    this.StatuschartOptions = {
      chart: {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 45
        },
        height: 250,
        width: 450
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
          innerSize: 65,
          depth: 35,
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}:</b> <span style="opacity: 0.5; color: red">' + '{y}</span>',
            connectorColor: '#da2020',
            style: {
              fontFamily: 'Lexend',
              fontSize: '14px',
            }
    }
        },
      },
      credits: {
        enabled: false
      },
      series: [{
        colors: this.colorArray,
        name: 'Asset-Status',
        sliced: true,
        data: []
      }],
    };
  }
 
 

  ngOnInit(): void  {
    Cylinder(Highcharts);
    HC_3D(Highcharts);
    more(Highcharts);
    this.fetchStatusData();
  }
 
  fetchStatusData(): void {
    this.service.getData('asset/status').subscribe(
      res => {
        this.statusData = res  || [];
        this.updateChart();
      },
      error => console.error('Error fetching status data', error)
    );
  }
 
  transformData(data: any[]): [string, number][] {
    return data.map((item: any) => [item.StatusName, item.Count]);
  }
 
  updateChart(): void {
    const transformedData = this.transformData(this.statusData);

    
  const one = [{
      colors: this.colorArray,
      name: 'Asset-Status',
      sliced: true,
      data: transformedData
    }];
    
    // Highcharts.chart('chartmode1', this.StatuschartOptions);

    this.StatuschartOptions = {
      chart: {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 45
        },
        height: 250,
        width: 500
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
          innerSize: 65,
          depth: 35,
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}:</b> <span style="opacity: 0.5; color: red">' + '{y}</span>',
            connectorColor: '#da2020'
        
      
    }
        },
      },
      credits: {
        enabled: false
      },
      series: one
    };
  }

}