import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemManagementComponent } from './item-management/item-management.component';
import { SettingsComponent } from './settings/settings.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { ReportsComponent } from './reports/reports.component';
import { LoginComponent } from './login/login.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MapViewComponent } from './map-tabs/Addons/map-view/map-view.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartsComponent } from './charts/charts.component';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { PathViewComponent } from './map-tabs/Addons/path-view/path-view.component';
import { MapTabsComponent } from './map-tabs/map-tabs.component';
import { MapsComponent } from './maps/maps.component';

const routes: Routes = [
      {path:'',                        component:LoginComponent                                    },
      { path:'dashboard',              component:DashboardComponent,canActivate:[AuthGuard]        },
      { path:'Assets-view',            component:ChartsComponent, canActivate:[AuthGuard]          },
      { path: 'item-management',       component:ItemManagementComponent,  canActivate:[AuthGuard] },
      { path: 'workflow',              component:WorkflowComponent, canActivate:[AuthGuard]        },
      { path: 'settings',              component:SettingsComponent, canActivate:[AuthGuard]        },
      { path: 'reports',               component:ReportsComponent, canActivate:[AuthGuard]         },
      { path: 'map', component: MapTabsComponent, canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'zone-view', pathMatch: 'full' },
          { path: 'zone-view', component: MapViewComponent },
          { path: 'path-view', component: PathViewComponent },
        ]
    },
    { path: 'sample',               component:MapsComponent, canActivate:[AuthGuard]         },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    AuthService,
    AuthGuard
  ]
})
export class AppRoutingModule { }
