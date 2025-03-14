import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ReaderManagementComponent } from './Add-ons/reader-management/reader-management.component';
import { UserManagementComponent } from './Add-ons/user-management/user-management.component';
import { LocationComponent } from './Add-ons/location/location.component';
import { ConditionsComponent } from './Add-ons/conditions/conditions.component';
import { StatusComponent } from './Add-ons/status/status.component';
import { CategoryComponent } from './Add-ons/category/category.component';
import { LocationtypeComponent } from './Add-ons/location/locationtype/locationtype.component';
import { SettingsService } from './Add-ons/service/settings.service';
import { HttpClient } from '@angular/common/http';
import { ZonesTableComponent } from './Add-ons/location/zones-table/zones-table.component';
import { SitesTableComponent } from './Add-ons/location/sites-table/sites-table.component';
import { AreasTableComponent } from './Add-ons/location/areas-table/areas-table.component';
import { Fieldset } from 'primeng/fieldset';
import { PlantManagementComponent } from './Add-ons/plant-management/plant-management.component';
import { concatMap, forkJoin, from } from 'rxjs';
import { of } from 'rxjs';
import {  catchError, finalize, map } from 'rxjs/operators';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  @ViewChild('readerManagement') readerManagement!: ReaderManagementComponent;  
@ViewChild('userManagement') userManagement!: UserManagementComponent;  
@ViewChild('location') location!: LocationComponent; 
@ViewChild('conditions') conditions!: ConditionsComponent; 
@ViewChild('status') status!: StatusComponent; 
@ViewChild('category') category!: CategoryComponent; 
@ViewChild('zone') zone!: ZonesTableComponent; 
@ViewChild('site') site!: SitesTableComponent; 
@ViewChild('area') area!: AreasTableComponent; 
@ViewChild('plant') plant!: PlantManagementComponent; 

siteCollapse: boolean = true;
areaCollapse: boolean = true;
zoneCollapse: boolean = true;

show: boolean = true;

locationsname: any;
locationtype: any;

currentTab: number = -1; 

constructor(private service: SettingsService, private http: HttpClient) 
{ 
  
}

plantManagementData: any;
locationManagementData: any;
sitesManagementData: any;
conditionsManagementData: any;
categoryManagementData: any;
statusManagementData: any;
readerManagementData: any;
userManagementData: any;
locationtypeData: any;
siteData: any;
areaData: any;
zoneData: any;

ngOnInit() {

const apiRequests = [
  { key: 'plantManagementData', request: this.service.getData('plantmanagement/data') },
  { key: 'readerManagementData', request: this.service.getData('reader/data') },
  { key: 'userManagementData', request: this.service.getData('usermanagement/data') },
  { key: 'locationtypeData', request: this.service.getData('businesslocations/locationtype') },
  { key: 'siteData', request: this.service.getData('businesslocations/site') },
  { key: 'areaData', request: this.service.getData('businesslocations/area') },
  { key: 'zoneData', request: this.service.getData('businesslocations/zone') },
  { key: 'categoryManagementData', request: this.service.getData('category/data') },
  { key: 'conditionsManagementData', request: this.service.getData('condition/data') },
  { key: 'statusManagementData', request: this.service.getData('status/data') },
 

];

from(apiRequests)
  .pipe(
    concatMap((item) =>
      item.request.pipe(
        catchError((error) => {
          // console.error(`Error fetching ${item.key}:`, error);
          return of({ response: null }); 
        })
      ).pipe(
        map((response: any) => ({ key: item.key, response }))
      )
    ),
    // finalize(() => {
    //   this.show = false;
    // })
  )
  .subscribe({
    next: ({ key, response }) => {
      this.show = false;
      (this as any)[key] = response;

    },
    complete: () => {
      // console.log('All requests completed!');
    },
  });

 
  // forkJoin({
  //   category: this.service.getData('category/data'),
  //   condition: this.service.getData('condition/data'),
  //   reader: this.service.getData('reader/data'),
  //   status: this.service.getData('status/data'),
  //   userManagement: this.service.getData('usermanagement/data'),
  //   locationtype: this.service.getData('businesslocations/locationtype'),
  //   site: this.service.getData('businesslocations/site'),
  //   area: this.service.getData('businesslocations/area'),
  //   zone: this.service.getData('businesslocations/zone'),

  // }).subscribe({
  //   next: (res) => {
  //     // Assign data to respective properties
  //     this.categoryManagementData = res.category;
  //     this.conditionsManagementData = res.condition;
  //     this.readerManagementData = res.reader;
  //     this.statusManagementData = res.status;
  //     this.userManagementData = res.userManagement;
  //     this.locationtypeData = res.locationtype;
  //     this.siteData = res.site;
  //     this.areaData = res.area;
  //     this.zoneData = res.zone;

  //     // Pass data to other child components if needed
  //     // e.g., Combine or process data before passing
  //   },
  //   error: (err) => console.error('Error fetching data:', err),
  //   complete: () => console.log('All requests completed!'),
  // });

  this.locAdd(event)
}
ngOnChanges(){
 
    //   next: (res) => {
  // this.locAdd(event)
}
ngAfterViewInit(){
 
 
}

locAdd(event:any){

    this.service.getData('businesslocations/locationtype').subscribe(res => {
      this.locationtype = res;

      let locationname: string[] = [];
      for (const item of this.locationtype) {
        locationname.push(item.lc_name);
      }
      // console.log("parent",locationname);
      this.locationsname = locationname;
    });
}


onChange(event: any) {
  const index = event.index;

  if (this.currentTab !== index) {
    this.resetAllCheckboxes();
    this.currentTab = index;
  }

  if (index === 0) {
    this.plant.updateTable()
  
  }

  if (index === 1) {
    this.readerManagement.resetCheckbox();
  } else if (index === 2) {
    this.userManagement.resetCheckbox();
  }
}

onChange2(event: any) {
  const index = event.index;

  if (this.currentTab !== index) {
    this
    this.resetAllCheckboxes();
    this.currentTab = index;
  }

  if (index === 0) {
 
    this.plant.GetData()
    
 
  }
  if (index === 1) {
    this.location.resetCheckbox();
    this.zone.resetCheckbox();
    this.site.resetCheckbox();
    this.area.resetCheckbox();

  } else if (index === 2) {
    this.conditions.resetCheckbox();
  } else if (index === 3) {
    this.status.resetCheckbox();
  } else if (index === 4) {
    this.category.resetCheckbox();
  }
}


resetAllCheckboxes() {

  if (this.readerManagement) this.readerManagement.resetCheckbox();
  if (this.userManagement) this.userManagement.resetCheckbox();
  if (this.location) this.location.resetCheckbox();
  if (this.conditions) this.conditions.resetCheckbox();
  if (this.status) this.status.resetCheckbox();
  if (this.category) this.category.resetCheckbox();
  if (this.zone) this.zone.resetCheckbox();
  if (this.site) this.site.resetCheckbox();
  if (this.area) this.area.resetCheckbox();


}

}