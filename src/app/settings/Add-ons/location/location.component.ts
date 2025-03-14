import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SettingsService } from '../service/settings.service';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],

})
export class LocationComponent {
@Output() locName = new EventEmitter()
@Input() locationsData: any;

  locationtype: any;
  pipe = new DatePipe('en-US');
  date=new Date();

  form: any;
  editform: any;
  display: boolean = false;
  close = faCircleXmark

  endpoint="businesslocations/locationtype"

  constructor(private confirmation: ConfirmationService, private service: SettingsService,private http: HttpClient,private messageService: MessageService, private fb:FormBuilder,private cookie: CookieService)
  {

    this.form=this.fb.group({
      lc_code:["",Validators.required],
      lc_name:["",Validators.required],
      lc_createdby:["",Validators.required],
      lc_createdon:["",Validators.required]
    });

  }

  ngOnInit(){
    // this.service.getData(this.endpoint).subscribe(res =>{
      // this.locationtype = res
      // console.log(res)
      // }); 
      
  }

  selected: any = [];
  ModalType = 'ADD'

ngOnChanges():void{
  this.locationtype = this.locationsData

  if(this.selected){
    this.form.patchValue(this.selected)
    this.ModalType = 'UPDATE'
  }
  else{
    this.form.reset();
    this.ModalType = 'ADD'
  }
}

  codeEndpoint = "locationcode"
  selectedData: any = null
  code: any;

  showDialog(){

    this.display = true;
    this.form.reset()
    this.selectedData = null
     this.ModalType = 'ADD'
  
    this.service.getData(this.codeEndpoint).subscribe(
      res =>{
        this.code = res.lc_code
        this.form.get('lc_code')?.setValue(this.code)
        this.form.controls['lc_code'].setValue(this.code);
        let username=this.cookie.get('username')
        let modifiedon=this.pipe.transform(this.date, 'yyyy-MM-dd');
        this.form.controls['lc_createdon'].setValue(modifiedon);
        this.form.controls['lc_createdby'].setValue(username);
    },
    error => {
      this.closeModal()
      this.messageService.add({ severity: 'error', summary: 'Code Not Generated', detail: 'Failed', life: 5000 });
      console.log("Error")
    }
  )
  }

  edit(i:any){

    this.selectedData = i;
    this.display = true;  
    this.form.patchValue(this.selectedData)
    this.ModalType = 'UPDATE'
  }
  
  closeModal(){
    this.form.reset();
    this.display = false
  }

  SavaData(Data:any){
    // this.locationtype.push(Data)
    this.locationtype.unshift(Data);
    
  }

  Update(Update:any){
    const i = this.locationtype.findIndex((user:any) => user.lc_code === this.selectedData.lc_code);
    this.locationtype[i] = Update;
  }

  OnSubmit(){

  if(this.ModalType==='UPDATE'){
    this.OnUpdate();
  }
  else{
    this.OnSave(this.form.value);
  }

 }

  resetCheckbox(){
    this.selected = []
  }


OnSave(form:any){
  if (this.form.valid) {
    this.service.postData(this.endpoint,this.form.value).subscribe(
      response =>{
        this.locationtype = [...this.locationtype, response];
        // this.SavaData(form)
        this.form.reset();
        this.closeModal();
        this.locName.emit(this.locationtype)
     
        this.messageService.add({ severity: 'success', summary: 'Added', detail:'Sucessfully', life: 4000 });
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Failed to Add', detail: 'Failed', life: 4000 });
        console.log("Error")
      }
    )
  }
}

OnUpdate(){
  if(this.selected){

    this.service.putData(this.endpoint, this.form.value).subscribe(
      update =>{
      
        this.Update(this.form.value)
        this.closeModal();
        this.locName.emit(this.locationtype)
        this.messageService.add({ severity: 'info', summary: 'Updated', detail:'Sucessfully', life: 4000 });
      },
      error => {
     
        this.messageService.add({ severity: 'error', summary: 'Not Updated', detail: 'Failed', life: 4000 });
        console.log("Error")
      }
    )
  }
}


deleteRow(i:any){
  if (this.selected.length === 0) {
    this.messageService.add({ severity: 'warn', summary: 'No Selection', detail: 'Please select at least one row to delete.', life: 4000 });
    return;
  }

  this.confirmation.confirm({
    message: 'Are you sure, you want to delete the selected Location?',
    header: 'Delete Confirmation', 
    icon: 'pi pi-exclamation-circle',
    acceptButtonStyleClass:"p-button-danger p-button-text",
    rejectButtonStyleClass:"p-button-text p-button-text",
    acceptIcon:"none",
    rejectIcon:"none",
    accept: () => {
      this.DeleteData();
      this.Loadtable()
    }
  });

}

Loadtable(){
  this.service.getData(this.endpoint).subscribe((data: any)  =>{
    this.locationtype = data
  });
}

DeleteData() {
  const totalItems = this.selected.length;
  let deletedCount = 0;
  let errorCount = 0;

  if (totalItems === 0) return;

  // Function to show a single toast message
  const showResultToast = () => {
    if (deletedCount > 0) {
      this.messageService.add({ severity: 'success', summary: 'Deleted', detail: `Successfully deleted ${deletedCount} item(s).`, life: 4000 });
    }
    if (errorCount > 0) {
      this.messageService.add({ severity: 'error', summary: 'Failed', detail: `Failed to delete ${errorCount} item(s).`, life: 4000 });
    }
  };

  for (let i = 0; i < this.selected.length; i++) {
    const code = this.selected[i].lc_code;
    const name = this.selected[i].lc_name;

    this.service.deleteData(this.endpoint, code).subscribe(
      () => {
        deletedCount++;
        const index = this.locationtype.findIndex((site: any) => site.lc_code === code);
        if (index !== -1) {
          this.locationtype.splice(index, 1);
        }
      },
      error => {
        errorCount++;
        console.error(`Error deleting item with code ${code}:`, error);
      },
      () => {
        // Show result toast after all operations are complete
        if (deletedCount + errorCount === totalItems) {
          showResultToast();
        }
      }
    );
    this.locName.emit(this.locationtype)
  }

  this.selected = [];
}
// DeleteData(){

//   // Loop through selected items
//   for (let i = 0; i < this.selected.length; i++) {
//     const code = this.selected[i].lc_code;
//     const name = this.selected[i].lc_name;

//     // Perform deletion for each selected item
//     this.service.deleteData(this.endpoint, code).subscribe(
//       () => {
//         // Remove the deleted item from the sites array
//         const index = this.locationtype.findIndex((site: any) => site.lc_code === code);
//         if (index !== -1) {
//           this.locationtype.splice(index, 1);
//         }
//         // Optionally, show success message for each deletion
//         this.messageService.add({ severity: 'success', summary: 'Deleted', detail: `${name} - Successfully deleted`, life: 4000 });
//       },
//       error => {
//         // Show error message if deletion fails
//         this.messageService.add({ severity: 'error', summary: 'Not Deleted', detail: `${name} - Failed to delete`, life: 4000 });
//         console.error(`Error deleting item with code ${code}:`, error);
//       }
//     );
//   }

//   this.selected = [];
// }


}
