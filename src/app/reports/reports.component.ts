import { Component, ViewChild } from '@angular/core';
import { PathTrackingComponent } from './Addons/path-tracking/path-tracking.component';
import { DwellReportComponent } from './Addons/dwell-report/dwell-report.component';
import { InoutReportComponent } from './Addons/inout-report/inout-report.component';
import { AssetAvailabilityComponent } from './Addons/asset-availability/asset-availability.component';
import { MplComponent } from './Addons/mpl/mpl.component';
import { MonthlyReportComponent } from './Addons/monthly-report/monthly-report.component';
import { forkJoin } from 'rxjs';
import { ReportService } from './service/report.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  activeIndex: number = 0;
    // ViewChild to access the child components
    @ViewChild(PathTrackingComponent) pathTracking!: PathTrackingComponent;
    @ViewChild(DwellReportComponent) dwellReport!: DwellReportComponent;
    @ViewChild(InoutReportComponent) inoutReport!: InoutReportComponent;
    @ViewChild(AssetAvailabilityComponent) assetAvailability!: AssetAvailabilityComponent;
    @ViewChild(MplComponent) mpl!: MplComponent;
    @ViewChild(MonthlyReportComponent) monthlyReport!: MonthlyReportComponent;

    // Define the paths for default and GIF backgrounds
   public defaultBackground: string = '../../assets/background.png'; // Replace with your default image path
   public pathTrackingGif: string = '../../assets/pathtracking.gif'; // Replace with your GIF path

  tabs: { iconRed: string, iconWhite: string, name : string}[] = [
    {name: 'PathTrackingComponent', iconRed: '../../assets/reports/path.png', iconWhite: '../../assets/reports/onclick/path.png' },
    {name: 'DwellReportComponent', iconRed: '../../assets/reports/dwell.png', iconWhite: '../../assets/reports/onclick/dwell.png' },
    {name: 'InOutReportComponent', iconRed: '../../assets/reports/inout.png', iconWhite: '../../assets/reports/onclick/inout.png' },
    {name: 'AssetsAvailabilityComponent', iconRed: '../../assets/reports/availl.png', iconWhite: '../../assets/reports/onclick/avail.png' },
    {name: 'MplComponent', iconRed: '../../assets/reports/mpl.png', iconWhite: '../../assets/reports/onclick/mpl.png' },
    {name: 'MonthlyReportComponent', iconRed: '../../assets/reports/monthly.png', iconWhite: '../../assets/reports/onclick/monthly.png' }
  ];

  constructor(private service: ReportService){}
  show:boolean=true;
  siteData: any;
  areaData: any;
  zoneData: any;
  categoryData: any;

  ngOnInit() {
   
    forkJoin({
      category: this.service.getData('category/data'),
      site: this.service.getData('businesslocations/site'),
      area: this.service.getData('businesslocations/area'),
      zone: this.service.getData('businesslocations/zone'),
  
    }).subscribe({
      next: (res) => {
        this.show = false
        this.categoryData = res.category;
        this.siteData = res.site;
        this.areaData = res.area;
        this.zoneData = res.zone;

      },
      error: (err) => console.error('Error fetching data:', err),
      // complete: () => console.log('All requests completed!'),
    });
  
    
  }

  //changing function
  onTabChange(event: any) {
    this.activeIndex = event.index;
    this.updateBackgroundImage();
    const selectedIndex = event.index;

    switch (selectedIndex) {
      case 0:
        this.pathTracking.resetForm(); // Reset Path Tracking form
        break;
      case 1:
        this.dwellReport.resetForm(); // Reset Dwell Report form
        break;
      case 2:
        this.inoutReport.resetForm(); // Reset In & Out Report form
        break;
      case 3:
        this.assetAvailability.resetForm(); // Reset Asset Availability form
        break;
      case 4:
        this.mpl.resetForm(); // Reset MPL form
        break;
      case 5:
        this.monthlyReport.resetForm(); // Reset Monthly Report form
        break;
      default:
        break;
    }
  }

  //update background image based on tabs
  updateBackgroundImage(): void {
    const defaultImageElement = document.getElementById('defaultImage') as HTMLImageElement;
    const pathTrackingElement = document.getElementById('pathTrackingImage') as HTMLImageElement;

    if (defaultImageElement && pathTrackingElement) {
      if (this.tabs[this.activeIndex].name === 'PathTrackingComponent') {
        defaultImageElement.style.display = 'none';
        pathTrackingElement.style.display = 'block';
        pathTrackingElement.style.width = '60%';
        pathTrackingElement.style.position = 'absoute';
        pathTrackingElement.style.overflow = 'hidden';
        pathTrackingElement.style.left = '15%';
        pathTrackingElement.style.top = '200px';
      } else {
        defaultImageElement.style.display = 'block';
        defaultImageElement.style.left = '30%';
        defaultImageElement.style.overflow = 'hidden';
        defaultImageElement.style.position = 'fixed';
        pathTrackingElement.style.display = 'none';
        defaultImageElement.style.opacity = '.2';
      }
    }
  }
  //for changing the con color to white when clicked
  getImageSource(index: number): string {
    return this.activeIndex === index ? this.tabs[index].iconWhite : this.tabs[index].iconRed;
  }



}

