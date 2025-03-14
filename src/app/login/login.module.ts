import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DropdownModule } from 'primeng/dropdown';


@NgModule({
  declarations: [
    LoginComponent,
  ],
  providers: [MessageService],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ToastModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    DropdownModule
  ],
  exports:[LoginComponent]
})
export class LoginModule { }
