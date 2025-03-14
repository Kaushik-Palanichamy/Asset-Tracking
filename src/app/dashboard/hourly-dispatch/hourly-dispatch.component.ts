import { Component, Input, ViewChild } from "@angular/core";
import { FormBuilder,  FormGroup } from '@angular/forms';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexMarkers,
  ApexYAxis
} from "ng-apexcharts";
import { DashboardService } from "../service/dashboard.service";
import { DatePipe } from "@angular/common";
import { MatSlider } from "@angular/material/slider";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  markers: ApexMarkers;
};

@Component({
  selector: 'app-hourly-dispatch',
  templateUrl: "./hourly-dispatch.component.html",
  styleUrls: ["./hourly-dispatch.component.css"]
})
export class HourlyDispatchComponent {
  @Input() hourlyData: any;
  
  date=new Date()
  pipe= new DatePipe("en-US")
  showTime: any;
  checked: boolean = false;
  // value!: number;

  @ViewChild('timeSlider') timeSlider!: MatSlider;
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  max = 24;
  min = 1;
  showTicks = true;
  step = 1;
  thumbLabel = true;
  value = 0;

  apiData: any;
  form: FormGroup;

  minDate: Date;
  maxDate: Date;

  constructor(private service:DashboardService,private fb: FormBuilder)
  {
    this.minDate = new Date(2018, 0, 1);
    this.maxDate = new Date();
   

    this.form = this.fb.group({
      date: ['']
    });

    this.chartOptions = {
      series: [],
      chart: {
        height: 290,
        type: "area",
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false,
        }
      },
      markers: {
        size: 4,
        hover: {
          size: 6
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight",
        width:2,
      },
      title: {
        text: "",
        align: "left",

      },

      grid: {
        row: {
          colors: ["#ffbaba", "transparent"], 
          opacity: 0.1
        }
      },
      xaxis: {
        categories:[],
        
      }
    };
  }

  ngOnInit() {
    this.GetData();

    this.form.patchValue({
      date: new Date()
    });

   }

  ngOnChanges(){
    this.apiData = this.hourlyData
    this.GetData()
  }

  GetData(){
    //  let datedata = {date: this.pipe.transform(new Date(), 'YYYY-MM-dd')}
    //  this.service.postData('virtualreport/hourlyreport',datedata).subscribe(res =>{
      this.apiData = this.hourlyData.hourlychart
      //  console.log(this.apiData)
     this.AssetsInChart();
    //  })
   }

  AssetsInChart(){

      let data = this.apiData
      let len = data.length
      // console.log(data)
      let labelArray=[];
      let InArray=[];
      let outArray=[];

      for(let i=0; i<len; i++){
          labelArray.push(data[i].lable)
          InArray.push(data[i].In)
          outArray.push(data[i].Out)
      }

      this.chartOptions = {
            series: [
              {
                name: "Asset In",
                data: InArray,
                color:'#ff7b7b',
              }
            ],
            chart: {
              height: 290,
              type: "area",
              zoom: {
                enabled: false
              },
              toolbar: {
                show: false,
              }
            },
            markers: {
              size: 4,
              hover: {
                size: 6
              }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: "straight",
              width:2,
            },
            title: {
              text: "",
              align: "left",

            },

            grid: {
              row: {
                colors: ["#ffbaba", "transparent"], // takes an array which will be repeated on columns
                opacity: 0.1
              }
            },
            xaxis: {
              categories:labelArray,
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
            }
          };
  }

  AssetsOutChart(){
    let data = this.apiData
    let len = data.length
    // console.log(data)
    let labelArray=[];
    let InArray=[];
    let outArray=[];

    for(let i=0; i<len; i++){
        labelArray.push(data[i].lable)
        outArray.push(data[i].Out)
    }

    this.chartOptions = {
          series: [
            {
              name: "Asset Out",
              data: outArray,
              color:'#ff7b7b',
            }
          ],
          chart: {
            height: 290,
            type: "area",
            zoom: {
              enabled: false
            },
            toolbar: {
              show: false,
            }
          },
          markers: {
            size: 4,
            hover: {
              size: 6
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: "straight",
            width:2,
          },
          title: {
            text: "",
            align: "left",

          },

          grid: {
            row: {
              colors: ["#ffbaba", "transparent"], // takes an array which will be repeated on columns
              opacity: 0.1
            }
          },
          xaxis: {
            categories:labelArray,
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
          }
        };
  }

  togglebtn(){
  // console.log("changed")
  
  if (this.checked) {
    this.AssetsOutChart();
    this.value = 0;
  } else {
    this.AssetsInChart();
    this.value = 0;
  }
  }

  ngAfterViewInit(): void {

  }

  InRange(rangeValue: any){

    // console.log("range",rangeValue);
    this.showTime = rangeValue;

    let data = this.apiData
    let len = data.length

    let labelArray = [];
    let InArray = [];

  for (let i = 0; i < len; i++) {
    labelArray.push(data[i].lable);
    InArray.push(data[i].In);
  }

const InitialData = {
  labels: labelArray,
  datasets: [
    {
      name: "Asset In",
      data: InArray,
      color:'#ff7b7b',
    }
  ]
};


const updatedLabels = [];
const updatedDatasets: any[] = [];

for (let i = 0; i < InitialData.labels.length; i += rangeValue) {
  let addLabel = InitialData.labels[i].split('-')[0];
  const lastIndex = Math.min(i + rangeValue - 1, InitialData.labels.length - 1);

  if (i !== lastIndex) {
    addLabel += ` -${InitialData.labels[lastIndex].split('-')[1]}`;
  }
  updatedLabels.push(addLabel);

  const addData = InitialData.datasets.map(dataset => {
    const newData = dataset.data.slice(i, i + rangeValue).reduce((acc, val) => acc + val, 0);
    return newData;
  });
  updatedDatasets.push(addData);
}

const UpdatedData = {
  labels: updatedLabels,
  series: InitialData.datasets.map(dataset => ({
    name: dataset.name,
    data: updatedDatasets.map(data => data[InitialData.datasets.indexOf(dataset)]),
     color:'#ff7b7b'
  }))
  };

  this.chartOptions.series = UpdatedData.series
  this.chartOptions.xaxis = {categories:UpdatedData.labels}
  }

  OutRange(rangeValue: any){

    // console.log("range",rangeValue);
    this.showTime = rangeValue;

    let data = this.apiData
    let len = data.length

    let labelArray = [];
    let OutArray = [];

for (let i = 0; i < len; i++) {
  labelArray.push(data[i].lable);
  OutArray.push(data[i].Out);

}

const InitialData = {
  labels: labelArray,
  datasets: [
    {
      name: "Asset Out",
      data: OutArray,
      color:'#ff7b7b',
    }
  ]
};

const updatedLabels = [];
const updatedDatasets: any[] = [];

for (let i = 0; i < InitialData.labels.length; i += rangeValue) {
  let addLabel = InitialData.labels[i].split('-')[0];
  const lastIndex = Math.min(i + rangeValue - 1, InitialData.labels.length - 1);

  if (i !== lastIndex) {
    addLabel += ` -${InitialData.labels[lastIndex].split('-')[1]}`;
  }
  updatedLabels.push(addLabel);

  const addData = InitialData.datasets.map(dataset => {
    const newData = dataset.data.slice(i, i + rangeValue).reduce((acc, val) => acc + val, 0);
    return newData;
  });
  updatedDatasets.push(addData);
}

const UpdatedData = {
  labels: updatedLabels,
  series: InitialData.datasets.map(dataset => ({
    name: dataset.name,
    data: updatedDatasets.map(data => data[InitialData.datasets.indexOf(dataset)]),
     color:'#ff7b7b'
  }))
  };

  this.chartOptions.series = UpdatedData.series
  this.chartOptions.xaxis = {categories:UpdatedData.labels}
  }

  onChangeRange(rangeValue: any) {

    this.showTime = rangeValue;

    if (this.checked) {
      this.OutRange(this.value);
    }
     else {
      this.InRange(this.value);
    }
    }


  OnSubmit(event: any){


    let events =  {date: this.pipe.transform(event,"yyyy-MM-dd")}
    // console.log("Date",events)


    this.service.postData('virtualreport/hourlyreport',events).subscribe(res =>{
      this.value = 0;
      this.apiData = res.hourlychart

      this.AssetsInChart();
    });

  }

}
