import { Component,Input,OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Table, TableModule } from 'primeng/table';
import { DashboardService } from '../service/dashboard.service';



@Component({
  selector: 'app-asset-table',
  templateUrl: './asset-table.component.html',
  styleUrls: ['./asset-table.component.css']
})
export class AssetTableComponent {
  @Input() AssetTableData: any;
  Table: any = { Location_Wise: [] }
   
  @ViewChild('dt', { static: true })
  dt!: Table;
  
  assetCount: any;

  constructor(private service: DashboardService)
  {

  }

  ngOnInit(){
    // this.service.postdata("overview/categorytotal").subscribe(res=>{
    //   this.Table=res
    //  });

  }

  ngOnChanges(){
    this.Table = this.AssetTableData
  }

  visible:boolean = false;

  AssetInDetails(selectedItem: any){
    this.visible=true;
    
    const payload = {
      cat_name: selectedItem.CategoryName,
      zone_location: 'inwards',
    };

    // console.log(payload)

    this.service.postData('overview/categorytotalcount', payload).subscribe(res =>{
      const items = res[0].item_name;
      const lastReadTimes = res[0].lastread_time;
  
      this.assetCount = items.map((item:any, index:any) => ({
          item_name: item,
          lastread_time: lastReadTimes[index],
      }));
    })
  }

  AssetOutDetails(selectedItem: any){
    this.visible=true;
    
    const payload = {
      cat_name: selectedItem.CategoryName,
      zone_location: 'outwards',
    };

    this.service.postData('overview/categorytotalcount', payload).subscribe(res =>{
      const items = res[0].item_name;
      const lastReadTimes = res[0].lastread_time;
  
      this.assetCount = items.map((item:any, index:any) => ({
          item_name: item,
          lastread_time: lastReadTimes[index],
      }));
    })
  }
}
