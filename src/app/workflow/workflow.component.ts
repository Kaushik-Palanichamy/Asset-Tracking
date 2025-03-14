import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { WorkflowService } from './service/workflow.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ItemManagementService } from '../item-management/Add-ons/service/item-management.service';
import { SettingsService } from '../settings/Add-ons/service/settings.service';
import * as XLSX from "xlsx-js-style";
import { DatePipe } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { faCircleXmark, faExpand, faMaximize, faWindowMaximize } from '@fortawesome/free-solid-svg-icons';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent implements OnInit, OnChanges  {
  // onTimeSelect(event: Date) {
  //   const formattedTime = this.formatTime(event);
  //   this.Addform.patchValue({ stime: formattedTime });
  //   this.Editform.patchValue({ stime: formattedTime });
  // }
  
  // private formatTime(date: Date): string {
  //   const hours = date.getHours().toString().padStart(2, '0');
  //   const minutes = date.getMinutes().toString().padStart(2, '0');
  //   return `${hours}:${minutes}`;
  // }
  

  pad(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }


@ViewChild('myTable', { static: true })
mytable!: Table;

@ViewChild('myTables', { static: false })
dtt!: Table;

dropdown: any;
selectedEvent = '' ;
selected: any = [];
selecteds: any = [];
date = new Date()
pipe = new DatePipe('en-US');

date3: Date | undefined;

tableData!: any ;
loading: boolean = false;

display: boolean=false;
Addform: any;
Addform2: any;
Editform: any;
Editform2:any
Editpopup: any;
Editpopup2: any;


checked: boolean = false;
value1= '';
value2= '';
value3= '';

priorityLevel: any

tickets: any;

conditions: any ;
status:any;
categorys: any;
items: any;
itemss: any[] = [];
displays: boolean = false;
ticketData: any;

endpoint ='workflow/dashboard'
endpoint2 = 'preventive/ticket'
code2: any;
close = faCircleXmark
maximize = faExpand
dayForm: any;
daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

@Input() selectedDays: string[] = []; // Input property to receive selected days
@Input() isEditMode: boolean = false; // Flag to determine if it's edit mode


constructor(private confirmationService: ConfirmationService, private http: HttpClient,private fb:FormBuilder,private cookie:CookieService,private service: WorkflowService,private messageService: MessageService,private Itemservice: ItemManagementService, private SettingsService: SettingsService)  {
  this.dropdown = [
      {name: 'None', code: ''},
      {name: 'Daily Status Report', code: 'Last Report'},

  ];
}

maximized: boolean = false;
@ViewChild('dialog') dialog!: Dialog;
@ViewChild('dialogs') dialogs!: Dialog;


toggleMaximize(dialog: Dialog) {
  if (this.maximized) {
    dialog.resetPosition(); 
    this.maximized = false;
  } else {
    dialog.maximize(); 
    this.maximized = true;
  }
}

  ngOnChanges(changes: SimpleChanges): void {

    throw new Error('Method not implemented.');
  }

categories:any;

ngOnInit(): void {
  this.GetData();

  // this.service.getData('condition/data').subscribe(res =>{
  //   this.conditions = res.map((condition: any) => ({ label: condition.cdn_name, value: condition.cdn_id }));
  //   console.log(res)
  //  });

  // this.service.getData("category/data").subscribe(res => {
  //   this.categories = res.map((category: any) => ({ label: category.cm_name, value: category.cm_id }));
  // });

  // this.service.getData('status/data').subscribe( res=>{
  //   this.status= res.map((status: any) => ({ label: status.st_name, value: status.st_id }))
  // });

  // this.service.getData('item/pathtracker').subscribe( res=>{
  //   this.items= res.map((item: any) => ({ label: item.im_name, value: item.im_id }))
  // });


   this.service.getData('workflow/dashboard').subscribe(res =>{
    this.tableData = res
    // console.log(res)
   });

   this.service.getData(this.endpoint2).subscribe(res =>{
    this.tickets = res
    // console.log(res)
   });
   this.Addform = this.fb.group({

    wfeventcode     :[""],
    wfeventname     :['', Validators.required],
    wfresetinterval :[0],
    wfdescription   :['', Validators.required],
    wfcreatedon     :[''],
    wfcreatedby     :[''],
    wfmodifiedon    : [''],
    wfmodifiedby   : [''],
    atoemail:  ['', [Validators.maxLength(255), this.customEmailValidator()]],
    asubject:  ['', Validators.required],
    amessage:  ['', Validators.required],
    stime: ['',Validators.required],
    schedule_days: this.fb.group({
      sun: [false],
      mon: [false],
      tue: [false],
      wed: [false],
      thu: [false],
      fri: [false],
      sat: [false],
    },
    { validators: [this.atLeastOneDaySelectedValidator] }),
});

this.Addform2 = this.fb.group({
  tkt_ticketcode:[''],
  tkt_remarks: ['',Validators.required],
  tkt_status: ['',Validators.required],
})
this.Editform = this.fb.group({

  wfeventcode     :['', Validators.required],
  wfeventname     :['', Validators.required],
  wfresetinterval :[0],
  wfdescription   :['', Validators.required],
  wfcreatedon     :['', Validators.required],
  wfcreatedby     :['', Validators.required],
  wfmodifiedon    : [""],
  wfmodifiedby   : [""],
  atoemail:  ['', [ Validators.maxLength(255), this.customEmailValidator()]],
  asubject:  ['', Validators.required],
  amessage:  ['', Validators.required],
  stime: ['', Validators.required],
  schedule_days: this.fb.group({
    sun: [false],
    mon: [false],
    tue: [false],
    wed: [false],
    thu: [false],
    fri: [false],
    sat: [false],
  }),


});
this.Editform2 = this.fb.group({
  tkt_ticketcode:[''],
  tkt_remarks: ['',Validators.required],
  tkt_status: ['',Validators.required],

});
}

// Custom validator function to check if at least one day is selected
atLeastOneDaySelectedValidator(control: AbstractControl): ValidationErrors | null {
  const days = control.value;
  const isOneDaySelected = Object.values(days).some(value => value === true);
  return isOneDaySelected ? null : { atLeastOneDay: true };
}

customEmailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    // Regular expression to match multiple emails separated by ';'
    const emailPattern = /^[^\s@]+@motherson\.com$/;
    const emails = control.value.split(';').map((email: string) => email.trim());
    
    const allValid = emails.every((email: string) => emailPattern.test(email));
    
    return allValid ? null : { 'invalidEmail': true };
  };
}

patchSelectedDays(selectedDaysString: any) {
  // console.log('selectedDaysString:', selectedDaysString);

  if (typeof selectedDaysString === 'string') {
    const daysArray = selectedDaysString.split(',').map(day => day.trim());

    // Log to ensure daysArray is as expected
    // console.log('daysArray:', daysArray);

    // Example: Set form controls based on daysArray
    this.dayForm.get('sun')?.setValue(daysArray.includes('sun'));
    this.dayForm.get('mon')?.setValue(daysArray.includes('mon'));
    this.dayForm.get('tue')?.setValue(daysArray.includes('tue'));
    this.dayForm.get('wed')?.setValue(daysArray.includes('wed'));
    this.dayForm.get('thu')?.setValue(daysArray.includes('thu'));
    this.dayForm.get('fri')?.setValue(daysArray.includes('fri'));
    this.dayForm.get('sat')?.setValue(daysArray.includes('sat'));

  } else {
    console.error('selectedDaysString is not a string:', selectedDaysString);
    // Handle error or set default values
    this.dayForm.reset();
  }
}


onTimeChange(event: any) {
  if (typeof event === 'string') {
    // Handle manual input scenario
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;  // Matches HH:mm format
    if (timeRegex.test(event.trim())) {
      this.Addform.get('stime')?.setValue(event.trim());
      this.Editform.get('stime')?.setValue(event.trim());
      return;
    }
  }
  
  // Handle picker-selected value
  const date = new Date(event);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  const formattedTime = `${hours}:${minutes}`;

  this.Addform.get('stime')?.setValue(formattedTime);
  this.Editform.get('stime')?.setValue(formattedTime);
}


closeModal(){
  this.Addform.reset();
  this.display = false
  
}

closeModal3(){
  this.Editform2.reset();
  this.Editpopup2 = false
  
}

resetCheckbox(){
  this.selected = []
}

closeModal2(){
  this.Editform.reset();
  this.Editpopup = false
}

GetData(){

}
applyFilterGlobal($event:any, stringValue:any){
  this.dtt.filterGlobal(($event.target as HTMLInputElement).value, stringValue);
 }

codeEndpoint = 'wfcode'

  SavaData(Data:any){
    this.tableData.push(Data)
  }

  SavaData2(Data:any){
    this.tickets.push(Data)
  }

  selectedData: any = null
  updatedData: any
  Update(updatedData: any) {
    this.Editpopup = false;
  
    if (!this.selectedData || !this.selectedData.wfcode) {
      console.error("Invalid selection: No row selected or missing 'wfcode'");
      return;
    }
  
    // Find the index of the row to update
    const index = this.tableData.findIndex((row: any) => row.wfcode === this.selectedData.wfcode);
  
    if (index !== -1) {
      // Ensure the time is correctly formatted before updating
      if (updatedData.stime) {
        updatedData.stime = this.convertToHHMM(updatedData.stime);
      }
  
      // Merge the updated data with the existing row
      this.tableData[index] = { ...this.tableData[index], ...updatedData };
  
      // Create a new reference to trigger Angular's change detection
      this.tableData = [...this.tableData];
  
      console.log("Row updated successfully with time:", updatedData.stime);
    } else {
      console.error("Row not found with wfcode:", this.selectedData.wfcode);
    }
  }
  
  // Helper function to convert time to HH:mm format
  private convertToHHMM(time: any): string {
    if (!time) return '00:00'; // Default fallback if time is empty or null
  
    if (typeof time === 'string' && time.includes('T')) {
      // Convert ISO string to Date object
      const date = new Date(time);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } else if (typeof time === 'string' && /^\d{2}:\d{2}$/.test(time.trim())) {
      // Already in HH:mm format, return as is
      return time.trim();
    } else if (time instanceof Date) {
      // If time is a Date object, format it
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
  
    console.error("Invalid time format:", time);
    return '00:00'; // Default fallback
  }
  
  



openDialog(){
  this.display = true;
  this.service.getData(this.codeEndpoint).subscribe(
    res =>{
    let code = res.wfeventcode
    this.Addform.get('wfeventcode')?.setValue(code)
    let username = this.cookie.get('username');
    let modifiedon=this.pipe.transform(this.date, 'yyyy-MM-dd');
    this.Addform.controls['wfmodifiedon'].setValue(modifiedon);
    this.Addform.controls['wfmodifiedby'].setValue(username);
    this.Addform.controls['wfcreatedon'].setValue(modifiedon);
    this.Addform.controls['wfcreatedby'].setValue(username);
    // console.log(modifiedon);
  })
}
getSelectedDays(days: any): string[] {
  return Object.keys(days).filter(key => days[key]).map(key => key.substring(1));
}
onSubmit() {
  this.display= false;
  if (this.Addform.invalid) {
    this.Addform.markAllAsTouched(); // Mark all fields as touched
    return;
  }
  else{
    this.service.getData('workflow/dashboard').subscribe(res =>{
      this.tableData = res
     });
    }
}

collectSelectedDays() {
  const selectedDays: string[] = [];
  const scheduleDaysForm = this.Addform.get('schedule_days') as FormGroup;

  if (scheduleDaysForm) {
    this.daysOfWeek.forEach(day => {
      if (scheduleDaysForm.get(day)?.value) {
        selectedDays.push(day);  // Remove the 's' prefix
      }
    });
  }

  return selectedDays;
}




AddNewForm() {
  const formValue = this.Addform.value;
  formValue.schedule_days = this.collectSelectedDays();
  //  console.log('Payload:', formValue); // Verify the payload
  //  console.log('Selected Days:', formValue.schedule_days);
  this.service.postData(this.endpoint,  this.Addform.value).subscribe(
    res => {
      this.SavaData(formValue);
      this.loadItems1();
      this.display = false;
      this.Addform.reset();
      this.messageService.add({ severity: 'success', summary: 'Added', detail: 'Successfully', life: 4000 });
    },
    error => {
      this.messageService.add({ severity: 'error', summary: 'Not Added', detail: 'Failed', life: 4000 });
      // console.log("Error");
    }
  );
  // console.log('formValue', formValue);
}

EditForm() {
  // Collect the selected days as a string before sending to the backend
  const selectedDays = this.collectSelectedDayss();

  // Clone the form's value to avoid mutating the original form data
  const payload = { ...this.Editform.value };

  // Replace the `schedule_days` object with the string of selected days
  payload.schedule_days = selectedDays;

  // Now, send the updated payload to the backend
  this.service.putData(this.endpoint, payload).subscribe(
    update => {
      this.Update(payload);
      this.loadItems1();
      this.messageService.add({ severity: 'info', summary: 'Updated', detail: 'Successfully', life: 4000 });
    },
    error => {
      this.messageService.add({ severity: 'error', summary: 'Not Updated', detail: 'Failed', life: 4000 });
      console.log("Error");
    }
  );
}

 loadItems1() {
  // Fetch the items from the server and assign them to the items array
  this.service.getData(this.endpoint).subscribe(
    (data: any[]) => {
      this.tableData = data;
    },
    (error) => {
      console.error('Failed to load items', error);
    }
  );
}


editRow(i: any) {
  this.Editpopup = true;
  this.selectedData = i;

  this.Editform.patchValue(this.selectedData);

  let selectedDaysString = this.selectedData.schedule_days;

  // Convert array to string if necessary
  if (Array.isArray(selectedDaysString)) {
    selectedDaysString = selectedDaysString.join(',');
  }

  if (typeof selectedDaysString === 'string') {
    const selectedDaysArray = selectedDaysString.split(',');
    this.daysOfWeek.forEach(day => {
      this.Editform.get('schedule_days').get(day).setValue(selectedDaysArray.includes(day));
    });
  } else {
    console.error('Unexpected type for selectedDaysString:', selectedDaysString);
  }

  // console.log('Form Values After Patch:', this.Editform.get('schedule_days').value); 
}

collectSelectedDayss(): string[] {
  const days = this.Editform.get('schedule_days').value;
  return this.daysOfWeek.filter(day => days[day]);
}

confirmDelete() {
  if (this.selected.length === 0) {
    this.messageService.add({ severity: 'warn', summary: 'No Selection', detail: 'Please select at least one row to delete.', life: 4000 });
    return;
  }
  this.confirmationService.confirm({
    message: 'Are you sure, you want to delete the selected Event?',
    header: 'Delete Confirmation',
    icon: 'pi pi-exclamation-circle',
    acceptButtonStyleClass:"p-button-danger p-button-text",
    rejectButtonStyleClass:"p-button-text p-button-text",
    acceptIcon:"none",
    rejectIcon:"none",
    accept: () => {
      this.deleteRow();
    }
  });
}

deleteRow() {
  if (this.selected.length === 0) {
    this.messageService.add({ severity: 'warn', summary: 'No Selection', detail: 'Please select at least one row to delete.', life: 4000 });
    return;
  }
   // Loop through selected items
   for (let i = 0; i < this.selected.length; i++) {
    const code = this.selected[i].wfeventcode;
    const name = this.selected[i].wfeventname;
    this.service.deleteDatas(this.endpoint, code).subscribe(
      () => {
        // Remove the deleted item from the sites array
        const index = this.tableData.findIndex((site: any) => site.wfeventcode === code);
        if (index !== -1) {
          this.tableData.splice(index, 1);
        }
        // Optionally, show success message for each deletion
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: `Successfully deleted item with name ${name}`, life: 4000 });
      },
      error => {
        // Show error message if deletion fails
        this.messageService.add({ severity: 'error', summary: 'Not Deleted', detail: `Failed to delete item with name ${name}`, life: 4000 });
        console.error(`Error deleting item with code ${name}:`, error);
      }
    );
  }
  this.selected = [];

  // this.service.deleteDatas(this.endpoint, item.wfeventcode).subscribe(
  //   () => {
  //     this.Editpopup = false;
  //     console.log(item.wfeventcode);
  //     const index = this.tableData.indexOf(item);
  //     if (index !== -1) {
  //       this.tableData.splice(index, 1);
  //     }
  //     this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Successfully', life: 4000 });
  //   },
  //   error => {
  //     this.messageService.add({ severity: 'error', summary: 'Not Deleted', detail: 'Failed', life: 4000 });
  //     console.error('Error deleting row:', error);
  //   }
  // );
}


//ticket management
ticketEndpoint = 'ticketcode'
code: any;
desc: any;
createdby: any;

// Update2(Update2:any){
//   const i = this.tickets.findIndex((user:any) => user.tm_code === this.selectedData.tm_code);
//   this.tickets[i] = Update2;
// }

openTicket() {
  this.displays = true;
  this.service.getData(this.ticketEndpoint).subscribe(
    res => {
      this.code = res.tm_code;
      const formattedDate = new Date(res.created_on).toISOString().split('T')[0];
      this.Addform2.patchValue({
        tkt_ticketcode: res.tkt_ticketcode,
        tkt_createdon: formattedDate,
      });
    },
    error => {
      console.error('Error fetching data:', error);
    }
  );
}

AddNewForm2(){
  const formValue = this.Addform2.value;
  if (formValue.tm_createdon) {
    const date = new Date(formValue.tm_createdon);
    formValue.tm_createdon = date.toISOString().split('T')[0]; // Format to yyyy-mm-dd
  }
  this.service.postData(this.endpoint2,this.Addform2.value).subscribe(
     res =>{
      this.SavaData2(this.Addform2.value)
      this.displays = false;
      this.Addform2.reset()
      this.messageService.add({ severity: 'success', summary: 'Added', detail:'Sucessfully', life: 4000 });
    },
     error => {
      this.messageService.add({ severity: 'error', summary: 'Not Added', detail: 'Failed', life: 4000 });
      console.log("Error")
    }

    )
    // console.log('formValue',this.Addform2.value)
}
editRow2(i: any) {
  this.Editpopup2 = true;
  this.selectedData = i;
  this.Editform2.patchValue(this.selectedData);
  this.code2 = this.selectedData.tkt_ticketcode;
  // console.log(this.Editform2.value);
}

EditForm2() {
  this.service.putData(this.endpoint2, this.Editform2.value).subscribe(
    update2 => {
      this.Update2(this.Editform2.value);
      this.Editpopup2 = false;
      this.loadItems();
      this.messageService.add({ severity: 'info', summary: 'Updated', detail: 'Successfully', life: 4000 });
    },
    error => {
      this.messageService.add({ severity: 'error', summary: 'Not Updated', detail: 'Failed', life: 4000 });
      // console.log(this.Editform2.value);
    }
  );
}

Update2(update: any) {
  const i = this.tickets.findIndex((user: any) => user.tkt_ticketcode === this.selectedData.tkt_ticketcode);
  this.tickets[i] = update;
}
 deleteRow2(row:any){

  this.service.deleteData(this.endpoint2, row.tkt_tickectcode).subscribe(
    () =>{
      this.Editpopup = false
      this.tableData.splice(row,1);
      this.loadItems();
      this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Successfully', life: 4000 });
    },
    error => {
      this.messageService.add({ severity: 'error', summary: 'Not Deleted', detail: 'Failed', life: 4000 });
      console.log("Error");
    }
  )

}
loadItems() {
  // Fetch the items from the server and assign them to the items array
  this.service.getData(this.endpoint2).subscribe(
    (data: any[]) => {
      this.tickets = data;
    },
    (error) => {
      console.error('Failed to load items', error);
    }
  );
}



//Excel Configurations
exportExcel(){
  const table = document.getElementById('dom');

  if (!table) {
    console.error("The table element with ID 'dom' does not exist.");
    return;
  }

  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);

  const merge = [
     { s: { r: 1, c: 1 }, e: { r: 2, c: 7 } },
   ];
   ws['!merges'] = merge;
   XLSX.utils.sheet_add_aoa(ws, [['WorkFlow Details']], { origin: 'B2' });


   // Leave 2 empty rows
   XLSX.utils.sheet_add_aoa(ws, [['']], { origin: 'B3' });
   XLSX.utils.sheet_add_aoa(ws, [['']], { origin: 'B4' });

   const headerRow = table.querySelector('thead tr');

   if (headerRow) {
    const headerData = [];
    const headerCells = headerRow.getElementsByTagName('th');
    for (let i = 1; i < headerCells.length -1; i++) {
      headerData.push(headerCells[i].textContent);
    }
    XLSX.utils.sheet_add_aoa(ws, [headerData], { origin: 'B5' });
  }

  // const tableData = [];
  // const rows = table.querySelectorAll('tbody tr');
  // for (let i = 0; i < rows.length; i++) {
  //  const rowData = [];
  //  const cells = rows[i].getElementsByTagName('td');
  //  for (let j = 0; j < cells.length ; j++) {
  //    // Skip the first and last cells in each row
  //    rowData.push(cells[j].textContent);
  //   }
  //   tableData.push(rowData);
  // }

  const tableDatas = this.tableData.map((item:any, index:any) => [
    index + 1, 
    item.wfeventname,
    item.wfdescription,
    item.wfcreatedon,
    item.wfcreatedby,
    item.wfmodifiedon,
    item.wfmodifiedby
  ]);

  
  XLSX.utils.sheet_add_aoa(ws, tableDatas, { origin: 'B6' });

  ws['!cols'] = [
    { wch: 10 },
    { wch: 5 },
    { wch: 30 },
    { wch: 20 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },

  ];


  for (var i in ws) {
    if (typeof ws[i] != 'object') continue;
    let cell = XLSX.utils.decode_cell(i);

    ws[i].s = {
      font: {
        italic: true,
      },
      alignment: {
        vertical: 'center',
        horizontal: 'center',
      },
      border: {
        right: { style: 'thin' },
        left: { style: 'thin' },
        top: { style: 'thin' },
        bottom: { style: 'thin' },
      },
    };

    if (cell.r == 1) {
      ws[i].s = {
        font: {
          sz: '15',
          color: { rgb: 'FF0000' },
        },
        alignment: {
          vertical: 'center',
          horizontal: 'center',
        },
      };
    }

    // Heading row
    if (cell.r == 4) {
      ws[i].s = {
        font: {
          bold: true,
          color: { rgb: 'fffcfd' },
        },
        alignment: {
          vertical: 'center',
          horizontal: 'center',
        },
        border: {
          right: { style: 'thin' },
          left: { style: 'thin' },
          top: { style: 'thin' },
          bottom: { style: 'thin' },
        },
      };
      ws[i].s.fill = {
        patternType: 'solid',
        fgColor: { rgb: 'ff3030' },
        bgColor: { rgb: 'ff3030' },
      };
    }

    if (!ws[i].v) {
      delete ws[i].s;
    }
  }

  const cellB4 = 'B4';
  const cellB4Style = {
    border: {
      top: { style: 'none' },
      bottom: { style: 'none' },
      left: { style: 'none' },
      right: { style: 'none' },
    },
  };
  ws[cellB4].s = cellB4Style;



  XLSX.utils.book_append_sheet(wb,ws);
  XLSX.writeFile(wb, 'Workflow_Details.xlsx')
}


exportTktExcel(){
  const table = document.getElementById('ticket');


  // Check if the table element exists
  if (!table) {
    console.error("The table element with ID 'ticket' does not exist.");
    return;
  }

  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);

  const headerRow = table.querySelector('thead tr');

  const merge = [
    { s: { r: 1, c: 1 }, e: { r: 2, c: 7 } },
  ];

  ws['!merges'] = merge;
  XLSX.utils.sheet_add_aoa(ws, [['Ticket Event Details']], { origin: 'B2' });

  // Leave 2 empty rows
  XLSX.utils.sheet_add_aoa(ws, [['']], { origin: 'B3' });
  XLSX.utils.sheet_add_aoa(ws, [['']], { origin: 'B4' });

  // Add the table header (th) row data to the worksheet
  if (headerRow) {
    const headerData = [];
    const headerCells = headerRow.getElementsByTagName('th');
    for (let i = 0; i < headerCells.length -1; i++) {
      headerData.push(headerCells[i].textContent);
    }
    XLSX.utils.sheet_add_aoa(ws, [headerData], { origin: 'B5' });
  }

  let filteredData = [];

  if (table && this.dtt.filteredValue) {
    filteredData = this.dtt.filteredValue.map((item: any, index: any) => [
      index + 1,
      item.tkt_ticketcode,
      item.tkt_gatewayname,
      item.tkt_description,
      item.tkt_ticketstatus,
      item.tkt_issuedatetime,
      item.tkt_remarks,
    
    ]);
  } else {
    
    filteredData = this.tickets.map((item: any, index: any) => [
      index + 1,
      item.tkt_ticketcode,
      item.tkt_gatewayname,
      item.tkt_description,
      item.tkt_ticketstatus,
      item.tkt_issuedatetime,
      item.tkt_remarks,
    ]);
  }

  
  XLSX.utils.sheet_add_aoa(ws, filteredData, { origin: 'B6' });

  // Column widths
  if (table || this.dtt.filteredValue) {
    ws['!cols'] = [
      { wch: 10 },
      { wch: 5 },
      { wch: 15 },
      { wch: 30 },
      { wch: 33 },
      { wch: 20 },
      { wch: 30 },
      { wch: 20 },
    
    ];
  }

  // Apply styles
  for (var i in ws) {
    if (typeof ws[i] !== 'object') continue;
    let cell = XLSX.utils.decode_cell(i);

    ws[i].s = {
      font: {
        italic: true
      },
      alignment: {
        vertical: 'center',
        horizontal: 'center',
      },
      border: {
        right: { style: 'thin' },
        left: { style: 'thin' },
        top: { style: 'thin' },
        bottom: { style: 'thin' },
      },
    };
    if (cell.r == 1) {
      ws[i].s = {
        font: {
          sz: '15',
          color: { rgb: 'FF0000' },
        },
        alignment: {
          vertical: 'center',
          horizontal: 'center',
        },
      };
    }

    // Heading row
    if (cell.r == 4) {
      ws[i].s = {
        font: {
          bold: true,
          color: { rgb: 'fffcfd' },
        },
        alignment: {
          vertical: 'center',
          horizontal: 'center',
        },
        border: {
          right: { style: 'thin' },
          left: { style: 'thin' },
          top: { style: 'thin' },
          bottom: { style: 'thin' },
        },
      };
      ws[i].s.fill = {
        patternType: 'solid',
        fgColor: { rgb: 'ff3030' },
        bgColor: { rgb: 'ff3030' },
      };
    }
    if (!ws[i].v) {
      delete ws[i].s;
    }
  }

  // Remove border style for B4 cell
  const cellB4 = 'B4';
  const cellB4Style = {
    border: {
      top: { style: 'none' },
      bottom: { style: 'none' },
      left: { style: 'none' },
      right: { style: 'none' },
    },
  };
  ws[cellB4].s = cellB4Style;

  // Append the sheet and export
  XLSX.utils.book_append_sheet(wb, ws);
  XLSX.writeFile(wb, 'Ticket_event.xlsx');
}
}
