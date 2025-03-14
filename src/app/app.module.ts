import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlider, MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonModule } from 'primeng/button';
import { FooterComponent } from './footer/footer.component';
import {MatTabsModule} from '@angular/material/tabs';
import { CardModule } from 'primeng/card';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ToolbarComponent } from './toolbar/toolbar.component';
// import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TableModule } from 'primeng/table';
import { ToolbarModule} from 'primeng/toolbar';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ItemManagementComponent } from '../app/item-management/item-management.component';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TabViewModule } from 'primeng/tabview';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule} from 'primeng/checkbox';
import { NewItemPopupComponent } from './item-management/Add-ons/new-item-popup/new-item-popup.component';
import { WebcamModule } from 'ngx-webcam';
import { CameraComponent } from './item-management/Add-ons/new-item-popup/camera/camera.component';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { FocusTrapModule } from 'primeng/focustrap';
import { ImageModule } from 'primeng/image';
import { HttpClientModule} from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { SidebarModule } from 'primeng/sidebar';
import { SplitterModule } from 'primeng/splitter';
import { SettingsComponent } from './settings/settings.component';
import { PlantManagementComponent } from './settings/Add-ons/plant-management/plant-management.component';
import { LocationComponent } from './settings/Add-ons/location/location.component';
import { ConditionsComponent } from './settings/Add-ons/conditions/conditions.component';
import { StatusComponent } from './settings/Add-ons/status/status.component';
import { CategoryComponent } from './settings/Add-ons/category/category.component';
import { ReaderManagementComponent } from './settings/Add-ons/reader-management/reader-management.component';
import { UserManagementComponent } from './settings/Add-ons/user-management/user-management.component';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { LocationtypeComponent } from './settings/Add-ons/location/locationtype/locationtype.component';
import { SitesTableComponent } from './settings/Add-ons/location/sites-table/sites-table.component';
import { AreasTableComponent } from './settings/Add-ons/location/areas-table/areas-table.component';
import { ZonesTableComponent } from './settings/Add-ons/location/zones-table/zones-table.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ReportsComponent } from './reports/reports.component';
import { PathTrackingComponent } from './reports/Addons/path-tracking/path-tracking.component';
import { DwellReportComponent } from './reports/Addons/dwell-report/dwell-report.component';
import { InoutReportComponent } from './reports/Addons/inout-report/inout-report.component';
import { AssetAvailabilityComponent } from './reports/Addons/asset-availability/asset-availability.component';
import { MonthlyReportComponent } from './reports/Addons/monthly-report/monthly-report.component';
import { MplComponent } from './reports/Addons/mpl/mpl.component';
import { DividerModule } from 'primeng/divider';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginModule } from './login/login.module';
import { MessageService,ConfirmationService } from 'primeng/api';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';

//PrimeNg imports
import { TabMenuModule } from 'primeng/tabmenu';
import { TreeModule } from 'primeng/tree';
import { FieldsetModule } from 'primeng/fieldset';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ChipsModule } from 'primeng/chips';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CommonModule, DatePipe } from '@angular/common';
import { PasswordModule } from "primeng/password";
import { MenubarModule } from 'primeng/menubar';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuModule } from 'primeng/menu';
import { HighchartsChartModule } from 'highcharts-angular';
import { ScrollTopModule } from 'primeng/scrolltop';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MapViewComponent } from './map-tabs/Addons/map-view/map-view.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartsComponent } from './charts/charts.component';
import { StatusChartComponent } from './charts/status-chart/status-chart.component';
import { CategoryChartComponent } from './charts/category-chart/category-chart.component';
import { FooterModule } from './footer/footer.module';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MatCard } from '@angular/material/card';
import { InputMaskModule } from 'primeng/inputmask';
import { SliderModule } from 'primeng/slider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SkeletonModule } from 'primeng/skeleton';
import { ChipModule } from 'primeng/chip';
import { PaginatorModule } from 'primeng/paginator';

//Dashboard Component
import { RecentTransactionsComponent } from './dashboard/recent-transactions/recent-transactions.component';
import { MonthlyDispatchComponent } from './dashboard/monthly-dispatch/monthly-dispatch.component';
import { ItemsCategoryComponent } from './dashboard/items-category/items-category.component';
import { HourlyDispatchComponent } from './dashboard/hourly-dispatch/hourly-dispatch.component';
import { CustDetailsComponent } from './dashboard/cust-details/cust-details.component';
import { AssetTableComponent } from './dashboard/asset-table/asset-table.component';
import { AssetOutcomeComponent } from './dashboard/asset-outcome/asset-outcome.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PathViewComponent } from './map-tabs/Addons/path-view/path-view.component';
import { MapTabsComponent } from './map-tabs/map-tabs.component';
import { MapsComponent } from './maps/maps.component';
import { NotificationComponent } from './notification/notification.component';

@NgModule({
    declarations: [
        AppComponent,
        ToolbarComponent,
        ItemManagementComponent,
        NewItemPopupComponent,
        CameraComponent,
        SettingsComponent,
        PlantManagementComponent,
        MonthlyReportComponent,
        LocationComponent,
        ConditionsComponent,
        StatusComponent,
        CategoryComponent,
        ReaderManagementComponent,
        UserManagementComponent,
        LocationtypeComponent,
        SitesTableComponent,
        AreasTableComponent,
        ZonesTableComponent,
        WorkflowComponent,
        ReportsComponent,
        PathTrackingComponent,
        DwellReportComponent,
        InoutReportComponent,
        AssetAvailabilityComponent,
        MplComponent,
        MapViewComponent,
        SidebarComponent,
        ChartsComponent,
        StatusChartComponent,
        CategoryChartComponent,
        RecentTransactionsComponent,
        MonthlyDispatchComponent,
        ItemsCategoryComponent,
        HourlyDispatchComponent,
        AssetOutcomeComponent,
        AssetTableComponent,
        CustDetailsComponent,
        DashboardComponent,
        PathViewComponent,
        MapTabsComponent,
        MapsComponent,
        NotificationComponent,

    ],
    providers: [DynamicDialogRef, MessageService, ConfirmationService,DatePipe,],
    bootstrap: [AppComponent],
    imports: [
        CommonModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        CardModule,
        NgApexchartsModule,
        // NgxDatatableModule,
        TableModule,
        ToolbarModule,
        BadgeModule,
        AvatarModule,
        InputTextModule,
        CalendarModule,
        TooltipModule,
        ToastModule,
        DynamicDialogModule,
        ScrollTopModule,
        TabViewModule,
        DropdownModule,
        CheckboxModule,
        WebcamModule,
        RippleModule,
        StyleClassModule,
        FocusTrapModule,
        ImageModule,
        HttpClientModule,
        DialogModule,
        SidebarModule,
        SplitterModule,
        TagModule,
        ConfirmDialogModule,
        InputSwitchModule,
        InputTextareaModule,
        DividerModule,
        FontAwesomeModule,
        LoginModule,
        PasswordModule,
        MenubarModule,
        TieredMenuModule,
        MenuModule,
        HighchartsChartModule,
        // FooterModule,
        TabMenuModule,
        TreeModule,
        MatTabsModule,
        FieldsetModule,
        OverlayPanelModule,
        InputGroupModule,
        InputGroupAddonModule,
        ChipsModule,
        ToggleButtonModule,
        MatTableModule,
        IconFieldModule,
        InputIconModule,
        ScrollPanelModule,
        FileUploadModule,
        KeyFilterModule,
        FooterModule,
        MatSliderModule,
        MatCardModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,
        InputMaskModule,
        SliderModule,
        SkeletonModule,
        ChipModule,
        PaginatorModule
    ]
})
export class AppModule { }
