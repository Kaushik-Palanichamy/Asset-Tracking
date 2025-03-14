import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer.component';

// import { TmNgOdometerModule } from 'tm-ng-odometer';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DialogModule } from 'primeng/dialog';
import { TimerComponent } from '../timer/timer.component';


@NgModule({
  declarations: [
    FooterComponent,
    TimerComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    DialogModule
  ],
  exports: [FooterComponent]
})
export class FooterModule { }
