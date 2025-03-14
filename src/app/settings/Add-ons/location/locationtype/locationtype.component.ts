import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SettingsService } from '../../service/settings.service';
// import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-locationtype',
  templateUrl: './locationtype.component.html',
  styleUrls: ['./locationtype.component.scss'],
  
})

export class LocationtypeComponent {

  pipe = new DatePipe('en-US');
  date=new Date();

  locationtype: any;

  // LocationTypeurl = 'assets/locationtype.json';

  form: any;
  editform: any;
  display: boolean = false;
  EditPopup: boolean = false;

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
    this.service.getData(this.endpoint).subscribe(res =>{
      this.locationtype = res
      // console.log(res)
      });     
  }

  selected: any = [];
  ModalType = 'ADD'

ngOnChanges():void{
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
        
        this.SavaData(form)
        this.form.reset();
        this.closeModal();
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
    }
  });

}

DeleteData(){

  // Loop through selected items
  for (let i = 0; i < this.selected.length; i++) {
    const code = this.selected[i].lc_code;

    // Perform deletion for each selected item
    this.service.deleteData(this.endpoint, code).subscribe(
      () => {
        // Remove the deleted item from the sites array
        const index = this.locationtype.findIndex((site: any) => site.lc_code === code);
        if (index !== -1) {
          this.locationtype.splice(index, 1);
        }
        // Optionally, show success message for each deletion
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: `Successfully deleted item with code ${code}`, life: 4000 });
      },
      error => {
        // Show error message if deletion fails
        this.messageService.add({ severity: 'error', summary: 'Not Deleted', detail: `Failed to delete item with code ${code}`, life: 4000 });
        console.error(`Error deleting item with code ${code}:`, error);
      }
    );
  }

  // Clear the selection after all deletions
  this.selected = [];
}

}
