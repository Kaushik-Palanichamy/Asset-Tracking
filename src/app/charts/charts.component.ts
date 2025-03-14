import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Highcharts from 'highcharts';
import HC_3D from 'highcharts/highcharts-3d';
import Cylinder from 'highcharts/modules/cylinder';
import HC_exporting from 'highcharts/modules/exporting';
import HC_exportData from 'highcharts/modules/export-data';
import more from "highcharts/highcharts-more";
import { AssetsViewService } from '../dashboard/service/assets-view.service';
import { StatusChartComponent } from './status-chart/status-chart.component';

HC_exporting(Highcharts);
HC_exportData(Highcharts);


@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {
  Highcharts = Highcharts;

  // url = 'assets/Assets-view.json'

  showCharts:boolean=true;

  @ViewChild("chart1") chart1!: any;
  @ViewChild("chart2") chart2!: any;
  @ViewChild("chart3") chart3!: any;
  @ViewChild("chart4") chart4!: any;

 SitechartOptions: any;
 AreachartOptions: any;
 ZonechartOptions: any;
 CondichartOptions: any;

  AreaData: any
  ZoneData: any

  colorArray = ['#F4846C','#A4D7BD',]
  colorArray2 = ['#4E2A77','#B9A2C4','#FABEAF']

  constructor(private service:AssetsViewService, private http:HttpClient)
  {
    Highcharts.setOptions({
      lang: {
        decimalPoint: '.',
        thousandsSep: ','
      }
    });
    //sitechart
    this.SitechartOptions = {
      chart: {
        type: 'column',
        options3d: {  
          enabled: true,
          alpha: 0,
          beta: 0,
          depth: 20,
          viewDistance: 30
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
        gridLineWidth: 0,
        minorGridLineWidth: 0,
        labels: {
          skew3d: true,
          style: {
            fontSize: "14px",
            fontFamily: 'Lexend',
            fontWeight: 'bold'
          }
        }
      },
      tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
        pointFormat: 'Total Assets: {point.y}'
      }, 
      lang: {
        decimalPoint: '.',
        thousandsSep: ','
      },
      plotOptions: {
        column: {
          depth: 60,
          dataLabels :{ 
            enabled: true,
             format: '{point.y}',
            colors: "#000000",
            style: {
              textOutline: 'none'}
          }
        },
        
        series: {
          cursor: 'pointer',  
          colorByPoint: true,
          // pointWidth: 25,
          point:{
          events: {
            click: (event: any) => {
              let DataIndex = event.point.index;
              this.AreaData = this.DynTiggeAreaChart(DataIndex);
              let Data = this.AreaData;
              // console.log(Data);
              let length = Data.length;
              let series = [];
              let catagories = [];
              for (let i = 0; i < length; i++) {
                  series.push(Data[i].AreaCount);
                  catagories.push(Data[i].Area);
              }
              let seriesData = [{
                  name: "Area-Assets",
                  data: series
              }];
  
              // Update area chart options
              this.AreachartOptions.xAxis.categories = catagories;
              this.AreachartOptions.series = seriesData;
              this.AreachartOptions = { ...this.AreachartOptions }; 
              
            }
          } 
        }      
        }
      },
      yAxis: {
        title: {
          text: ''
        },
        labels: {
          style: {
            fontFamily: 'Lexend', 
            fontSize: '12px',
            color: '#333'
          }
        }
      },
      credits:{
        enabled:false
      },
      series: [],
    };
  
  //area chart
  this.AreachartOptions = {
  chart: {
    type: 'column',
    options3d: {
      enabled: true,
      alpha: 0,
      beta: 0,
      depth: 20,
      viewDistance: 30
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
    gridLineWidth: 0,
    minorGridLineWidth: 0,
    labels: {
      skew3d: true,
      style: {
        fontSize: "14px",
        fontFamily: 'Lexend',
        fontWeight: 'bold'
      }
    }
  },
  tooltip: {
    headerFormat: '<b>{point.key}</b><br>',

  }, 
  lang: {
    decimalPoint: '.',
    thousandsSep: ','
  },
  plotOptions: {
    column: {
      depth: 60,
      dataLabels :{ 
        enabled: true,
        format: '{point.y}',
        colors: "#000000",
        style: {
          textOutline: 'none'}
      }
    },
    series: {
      cursor: 'pointer',  
      colorByPoint: true,
      // pointWidth: 15,
      point:{
        events: {
          click: (event: any) => {
            let DataIndex = event.point.index;
            this.AreaData = this.DynTiggerZoneChart(DataIndex);
            let Data = this.AreaData;
            // console.log("Data:", Data);            
            let length = Data.length;
            let series = [];
            let catagories = [];
            for (let i = 0; i < length; i++) {
                series.push(Data[i].ZoneCount);
                catagories.push(Data[i].zone);
            }
            let seriesData = [{
                name: "Zone-Assets",
                data: series
            }];

            // Update zone chart options
            this.ZonechartOptions.xAxis.categories = catagories;
            this.ZonechartOptions.series = seriesData;
            this.ZonechartOptions = { ...this.ZonechartOptions }; 
          }
        } 
      }           
    }
  },
  yAxis: {
    title: {
      text: ''
    },
    labels: {
      style: {
        fontFamily: 'Lexend', 
        fontSize: '12px',
        color: '#333'
      }
    }
  },
  credits:{
    enabled:false
  },
  series: [],
};

    //zone chart
    this.ZonechartOptions = {
      chart: {
        type: 'column',
        options3d: {
          enabled: true,
          alpha: 0,
          beta: 0,
          depth: 20,
          viewDistance: 30
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
        gridLineWidth: 0,
        minorGridLineWidth: 0,
        labels: {
          skew3d: true,
          style: {
            fontSize: "14px",
            fontFamily: 'Lexend',
            fontWeight: 'bold'
          }
        }
      },
      tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
        
      }, 
      lang: {
        decimalPoint: '.',
        thousandsSep: ','
      },
      plotOptions: {
        column: {
          depth: 60,
          dataLabels :{ 
            enabled: true,
            useHTML: true,
            format: '{point.y}',
            colors: "#000000",
            style: {
              textOutline: 'none'},
              verticalAlign: 'top',
              y: -25
          }
        },
        series: {
          cursor: 'pointer',  
          colorByPoint: true,
          // pointWidth: 15,
          point:{
            events: {
              click: (event: any) => {
                let DataIndex = event.point.index;
                let Data =  this.DynTiggerConditionChart(DataIndex);
                // console.log(Data);
                // let length = Data.length;
                // let series = [];
                // let catagories = [];
                // for (let i = 0; i < length; i++) {
                //     series.push(Data[i].ConditionData);
                //     catagories.push(Data[i].Condition);
                // }
                // let seriesData = [{ 
                //     name: "Asset-Condition",
                //     data: series
                // }];
                const seriesData = [{
                  name: 'Asset-Condition',
                  sliced: true,
                  data: Data.map((item:any) => [item.Condition, item.ConditionData])
                }];
    
                // Update condition chart options
                // this.CondichartOptions.xAxis.categories = catagories;
                this.CondichartOptions.series = seriesData;
                this.CondichartOptions = { ...this.CondichartOptions }; 
              }
            } 
          }     
        }
      },
      yAxis: {
        title: {
          text: ''
        },
        labels: {
          style: {
            fontFamily: 'Lexend', 
            fontSize: '12px',
            color: '#333'
          }
        }
      },
      credits:{
        enabled:false
      },
      series: [],
    };

    //condiChart
    this.CondichartOptions = {
      chart: {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 45,
        
        },
        height: 250, 
        width: 500,  
      
      },
     
      title: {
        text: ''
      },
      // legend: {
      //   verticalAlign: 'bottom'
      // },
      tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
      }, 
      lang: {
        decimalPoint: '.',
        thousandsSep: ','
      },
      plotOptions: {
         pie: {
          allowPointSelect: true,
          cursor: 'pointer',
        
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
        series: {
          cursor: 'pointer', 
          colorByPoint: true, 
          // pointWidth: 15,
               
        }
      },
      yAxis: {
        title: {
          text: ''
        },
        labels: {
          style: {
            fontFamily: 'Lexend', 
            fontSize: '12px',
            color: '#333'
          }
        }
      },
      credits:{
        enabled:false
      },
      series: [],
    };
}


  ngOnInit(): void{
    Cylinder(Highcharts);
    HC_3D(Highcharts);
    more(Highcharts);

    this.showCharts = true
    this.GetData()

  }

  apiData:any

  GetData(){
    this.service.getData('asset/dashboard').subscribe(
      res=>{
      this.apiData = res
      this.showCharts = false
      // console.log("chartapi",this.apiData)
      this.updateSiteChart()
      this.updataAreaChart(0)
      this.updateZoneChart(0);
      this.updateCondiChart(0);
  
    })
  }

  DynTiggeAreaChart(value:number){
    let chartdata = this.apiData
    return chartdata[value].SiteData
  }

  DynTiggerZoneChart(value:number){
    let chartdata = this.AreaData
    return chartdata[value].AreaData
    
}

  DynTiggerConditionChart(value:number){
    // let chartData = this.ZoneData
    // return chartData[value].ZoneData
    // console.log("Zone Data:", this.ZoneData);
    let chartData = this.ZoneData;
    if (chartData && chartData[value]) {
        return chartData[value].ZoneData;
    } else {
        console.error("Invalid Zone Data:", chartData);
        return [];
    }
  }

  updateSiteChart(): void {
    const categories = this.apiData.map((data: any) => data.Site);
    const seriesData = [{
      colors: this.colorArray,
      name: "Total Assets",
      data: this.apiData.map((data: any) => data.SiteCount),
    }];
    // console.log("site",seriesData)
    this.SitechartOptions.xAxis.categories = categories;
    this.SitechartOptions.series = seriesData;
    this.SitechartOptions.legend = {enabled: false}
  }

  updataAreaChart(siteIndex: number): void {
    const areaData = this.apiData[siteIndex].SiteData;
    // console.log("area",areaData)
    const categories = areaData.map((data: any) => data.Area);
    const seriesData = [{
      colors: this.colorArray,
      name: 'Area Assets',
      data: areaData.map((data: any) => data.AreaCount)
    }];

    this.AreachartOptions.xAxis.categories = categories;
    this.AreachartOptions.series = seriesData;
    this.AreachartOptions.legend = {enabled: false}
  }

  updateZoneChart(areaIndex: number): void {
    const zoneData = this.apiData[0].SiteData[areaIndex].AreaData;
    const categories = zoneData.map((data: any) => data.zone);
    const seriesData = [{
      colors: this.colorArray,
      name: 'Zone Assets',
      data: zoneData.map((data: any) => data.ZoneCount)
    }];

    this.ZonechartOptions.xAxis.categories = categories;
    this.ZonechartOptions.series = seriesData;
    this.ZonechartOptions.legend = {enabled: false}

    // Assign zoneData to this.ZoneData
    this.ZoneData = zoneData;
  }

  updateCondiChart(zoneIndex: number): void {
    // console.log("API Data:", this.apiData);
    // console.log("Site Data:", this.apiData[0].SiteData);
    // console.log("Area Data:", this.apiData[0].SiteData[0].AreaData);
    // console.log("Zone Index:", zoneIndex);
    
    const conditionData = this.apiData[0].SiteData[0].AreaData[zoneIndex].ZoneData;
    // console.log("Condition Data:", conditionData);
    
 
    const seriesData = [{
      colors: this.colorArray2,
      name: 'Asset-Condition',
      sliced: true,
      data: conditionData.map((item:any) => [item.Condition, item.ConditionData])
    }];
    // console.log("condi",seriesData)

    this.CondichartOptions.series = seriesData;
  }


}
