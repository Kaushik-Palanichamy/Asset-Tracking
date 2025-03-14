import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import {MatProgressBarModule, ProgressBarMode} from '@angular/material/progress-bar';
import { DashboardService } from '../service/dashboard.service';

@Component({
  selector: 'app-items-category',
  templateUrl: './items-category.component.html',
  styleUrls: ['./items-category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsCategoryComponent {
  @Input() property1 = "Default";
  @Input() AssetTableData: any;

  items: any;
  item: any;
  color =  '#da2020'
  mode:ProgressBarMode  = 'buffer';
  value :any;



    constructor(private service: DashboardService){}

    ngOnInit(){

      // this.service.postdata("overview/categorytotal").subscribe(res=>{
      //   this.items = res.Category_Wise

      //   this.item = res.TotalCount
      // this.service.GET().subscribe(res=>{
      //     this.items = res.Category_Wise
        // console.log(this.items)


      //  });
    }

    ngOnChanges(){
      this.items = this.AssetTableData.Category_Wise
      this.item = this.AssetTableData.TotalCount
    }
}
