import { Component, ViewChild, OnInit } from "@angular/core";
import { DashboardService } from "../service/dashboard.service";
import * as Highcharts from 'highcharts';
import HC_3D from 'highcharts/highcharts-3d';
import Cylinder from 'highcharts/modules/cylinder';
import HC_exporting from 'highcharts/modules/exporting';
import HC_exportData from 'highcharts/modules/export-data';
import more from "highcharts/highcharts-more";
import { DatePipe } from "@angular/common";
import { MessageService } from "primeng/api";

HC_exporting(Highcharts);
HC_exportData(Highcharts);
HC_3D(Highcharts);
Cylinder(Highcharts);
more(Highcharts);

@Component({
  selector: 'app-monthly-dispatch',
  templateUrl: './monthly-dispatch.component.html',
  styleUrls: ['./monthly-dispatch.component.css']
})
export class MonthlyDispatchComponent implements OnInit {

  @ViewChild("chart", { static: false }) chart: any;
  Highcharts = Highcharts;
  Options: any = {};
  weekData: any;
  weeks: any[] = [];
  selectedWeek: any;
  chartInstance: any;

  constructor(private service: DashboardService, private datePipe: DatePipe, private meaasgeService: MessageService)
  {
    this.initializeChartOptions();
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy(); // Destroy the chart instance
      this.chartInstance = null; // Clean up the reference
    }
  }

  ngOnInit(): void {
    this.generateWeeks(); 
    this.loadChartDataForCurrentWeek();

    const today = new Date();
    const currentYear = today.getFullYear();
    const firstDayOfYear = new Date(currentYear, 0, 1);
    const firstWeekStart = firstDayOfYear.getDay() === 0 ? 7 : firstDayOfYear.getDay();
    const daysSinceStart = Math.floor((today.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24));
    const currentWeekNumber = Math.ceil((daysSinceStart + firstWeekStart) / 7);

    this.selectedWeek = this.weeks.find(week => week.value === currentWeekNumber) || null;
  
  }

  initializeChartOptions(): void {
    this.Options = {
      chart: {
        type: 'column',
        width: 340,
        height: 250,
        options3d: {
          enabled: true,
          alpha: 20,
          beta: 0,
          depth: 50,
          viewDistance: 50
        },
        events: {
          load: () => {
            this.chartInstance = this.chart.chart; // Store the chart instance
          },
        }
      },
      title: { text: '' },
      xAxis: { gridLineWidth: 0, minorGridLineWidth: 0, categories: [],
        labels: {
          style: {
            fontFamily: 'Lexend', 
            fontSize: '12px',
            color: '#333'
          }
        }
       },
      yAxis: { title: { text: '' },
      labels: {
        style: {
          fontFamily: 'Lexend', 
          fontSize: '12px',
          color: '#333'
        }
      }
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          borderRadius: 0,
          pointWidth: 30,
          dataLabels: {
            enabled: false,
            color: "#000000",
            style: { textOutline: 'none' }
          }
        },
        series: {
          events: {
            legendItemClick: function (event: any) {
              // Cast `this` to Highcharts.Series
              const series = this as unknown as Highcharts.Series;
  
              // Ensure at least one series remains visible
              const visibleSeriesCount = series.chart.series.filter(s => s.visible).length;
              if (visibleSeriesCount === 1 && series.visible) {
                event.preventDefault(); // Prevent hiding the last visible series
                alert('At least one series must remain visible.');
              }
            }
          }
        }
      },
      legend: {
        layout: 'horizontal',
        align: 'right',
        verticalAlign: 'top',
        itemStyle: { color: '#333' }
      },
      credits: { enabled: false },
      series: [],
      noData: {
        style: {
          fontSize: '16px',
          color: '#606060'
        },
        useHTML: true,
        position: {
          align: 'center',
          verticalAlign: 'middle'
        }
      }
    };
  }
  
  

  // generateWeeks(): void {
  //   const today = new Date();
  //   const currentYear = today.getFullYear();
  //   const firstDayOfYear = new Date(currentYear, 0, 1);
  //   const daysSinceStart = Math.floor((today.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24));
  //   const currentWeekNumber = Math.ceil((daysSinceStart + 1) / 7);

  //   this.weeks = Array.from({ length: currentWeekNumber }, (_, i) => ({
  //     label: `CW ${i + 1}`,
  //     value: i + 1
  //   }));
  
  // }

  generateWeeks(): void {
    const today = new Date();
    const currentYear = today.getFullYear();
    const firstDayOfYear = new Date(currentYear, 0, 1);
    const firstWeekStart = firstDayOfYear.getDay() === 0 ? 7 : firstDayOfYear.getDay();
    const daysSinceStart = Math.floor((today.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24));
    const currentWeekNumber = Math.ceil((daysSinceStart + firstWeekStart) / 7);
  
    this.weeks = Array.from({ length: currentWeekNumber }, (_, i) => ({
      label: `CW ${i + 1}`,
      value: i + 1
    }));
  }
  

  // getWeekDates(year: number, weekNumber: number): { startDate: Date, endDate: Date } {
  //   const startDate = new Date(year, 0, 1 + (weekNumber - 1) * 7);
  //   const dayOfWeek = startDate.getDay();
  //   const startOfWeek = new Date(startDate.setDate(startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1))); // Ensure week starts on Monday
  //   const endOfWeek = new Date(startOfWeek);
  //   endOfWeek.setDate(startOfWeek.getDate() + 6);

  //   return { startDate: startOfWeek, endDate: endOfWeek };
  // }

  getWeekDates(year: number, weekNumber: number): { startDate: Date, endDate: Date } {
    const startDate = new Date(year, 0, 1 + (weekNumber - 1) * 7);
    const dayOfWeek = startDate.getDay();
    const startOfWeek = new Date(startDate.setDate(startDate.getDate() - dayOfWeek));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return { startDate: startOfWeek, endDate: endOfWeek };
  }
  

  onWeekChange(event: any): void {
    const selectedWeek = event.value ? event.value.value : null;

    if (selectedWeek !== null && typeof selectedWeek === 'number') {
      this.loadChartDataForWeek(selectedWeek);
    } else {
      console.error('Invalid week number:', selectedWeek);
    }
  }

  loadChartDataForCurrentWeek(): void {
    const today = new Date();
    const currentYear = today.getFullYear();
    const firstDayOfYear = new Date(currentYear, 0, 1);
    const daysSinceStart = Math.floor((today.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24));
    const currentWeekNumber = Math.ceil((daysSinceStart + 1) / 7);
    this.loadChartDataForWeek(currentWeekNumber);
  }

  loadChartDataForWeek(weekNumber: number): void {
    const year = new Date().getFullYear();
    const { startDate, endDate } = this.getWeekDates(year, weekNumber);

    const payload = {
      startdate: this.datePipe.transform(startDate, 'yyyy-MM-dd'),
      enddate: this.datePipe.transform(endDate, 'yyyy-MM-dd')
    };



    this.service.postData('virtualreport/weekwise', payload).subscribe(res => {
      this.weekData = res;
      this.updateChartOptions();
    }, 
    error => {
      console.error('Error fetching data:', error);
    });
  }
 
  updateChartOptions(): void {
    const Data = this.weekData || [];
    const In = Data.map((item: any) => item.inwards);
    const Out = Data.map((item: any) => item.outwards);
    const categories = Data.map((item: any) => item.date);
  
    // Update chart series and categories
    this.Options.series = [
      { name: 'Out', data: Out, type: 'column', color: '#d991f2', visible: true },
      { name: 'In', data: In, type: 'column', color: '#f07f7f', visible: true }
    ];
    this.Options.xAxis.categories = categories;
  
    // Add noData configuration
    this.Options.noData = {
      style: {
        fontSize: '16px',
        color: '#606060'
      },
      useHTML: true,
      position: {
        align: 'center',
        verticalAlign: 'middle'
      }
    };
  
    // Create or update the chart
    if (this.chartInstance) {
      this.chartInstance.update(this.Options, true);
    } else {
      this.chartInstance = Highcharts.chart('chartmodess', this.Options);
    }
  }
  
}
