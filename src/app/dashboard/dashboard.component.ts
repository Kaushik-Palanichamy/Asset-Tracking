import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { CustDetailsComponent } from './cust-details/cust-details.component';
import { HourlyDispatchComponent } from './hourly-dispatch/hourly-dispatch.component';
import { ItemsCategoryComponent } from './items-category/items-category.component';
import { AssetTableComponent } from './asset-table/asset-table.component';
import { MonthlyDispatchComponent } from './monthly-dispatch/monthly-dispatch.component';
import { AssetOutcomeComponent } from './asset-outcome/asset-outcome.component';
import { RecentTransactionsComponent } from './recent-transactions/recent-transactions.component';
import { DatePipe } from '@angular/common';
import { DashboardService } from './service/dashboard.service';
import { TableModule } from 'primeng/table';
import { catchError, concatMap, finalize, from, interval, map, of } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  show:boolean=true;
cards: any ; 
bcnDetails: any;
date=new Date()
pipe= new DatePipe("en-US")

custData: any;
hourlyData: any;
AssetTableData: any;
yearlyData: any;

constructor(private service:DashboardService)
  {
    this.GetData();
    // this.service.postdata('overview/assets_count').subscribe(res =>{
    //   this.bcnDetails = res

    // })
  }

ngOnInIt(){

}

tdyMovements: any;

GetData(){
  let today = new Date();
    today.setDate(today.getDate());

    let CurrDate = {"date": this.pipe.transform(today,"yyyy-MM-dd") }
    // console.log("hai",CurrDate)
      // this.show = true
    // this.service.postData('overview/dashboard',CurrDate).subscribe(res =>{
    //   this.show = false
    //   this.cards = res.Cards
    //   this.tdyMovements = res
    // });

    // const now = new Date();
    // const currYear =  now.getFullYear();
    // let events =  {year: currYear }


    const apiRequests = [
     
      { key: 'bcnDetails', request: this.service.postdata('overview/assets_count',) },
      { key: 'custData', request: this.service.postdata('overview/vendordetails') },
      { key: 'hourlyData', request: this.service.postData('virtualreport/hourlyreport',CurrDate) },
      { key: 'AssetTableData', request: this.service.postdata('overview/categorytotal') },
      { key: 'dashboardData', request: this.service.postData('overview/dashboard', CurrDate) },
      // { key: 'yearlyData', request: this.service.postData('virtualreport/outwards',events) },
    ]
  
    from(apiRequests)
      .pipe(
        concatMap((item) =>
          item.request.pipe(
            catchError((error) => {
              return of({ response: null }); 
            })
          ).pipe(
            map((response: any) => ({ key: item.key, response }))
          )
        ),
        finalize(() => {
          this.show = false;
        })
      )
      .subscribe({
        next: ({ key, response }) => {
        
          if (key === 'dashboardData') {

            this.cards = response?.Cards[0] || [];
            this.tdyMovements = response || {};
          } 
          else {
            (this as any)[key] = response;
          }
       
        },
        complete: () => {
          // console.log('All requests completed!');
        },
      });

}


ngAfterViewInit(): void {
  // interval(40000).subscribe(() => {
  //   this.GetData();
  // });
}

}
