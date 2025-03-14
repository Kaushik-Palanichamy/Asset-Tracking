import { Component, Input } from '@angular/core';
import { SettingsService } from '../service/settings.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent {

@Input() statusData: any;
status: any;
loading: boolean = true;

form: any
display: boolean = false;

close = faCircleXmark
endpoint = "status/data"

date = new Date();
pipe= new DatePipe("en-US")

constructor(private service: SettingsService,private http: HttpClient,private fb:FormBuilder, private messageService: MessageService,private cookie:CookieService, private confirmation: ConfirmationService)
{
   // this.loading=true
  //  this.service.getData(this.endpoint).subscribe(res =>{
    // this.status = res
    // this.loading=false
  //  });
}

  ngOnInit(){
 
     this.form=this.fb.group({
      st_code:["",Validators.required],
      st_name:["",Validators.required],
      st_active:[null,Validators.required],
      st_createdby:["",Validators.required],
      st_createdon:["",Validators.required],
      st_modifiedby:["",Validators.required],
      st_modifiedon:["",Validators.required]
    });
  }

  selected: any = [];
  ModalType = 'ADD'
  codeEndpoint = "stcode"

  ngOnChanges():void{
    this.status = this.statusData
    
    if(this.selected  && this.form){
      this.form.patchValue(this.selected)
      this.ModalType = 'UPDATE'
    }
    else{

      if (this.form) {
        this.form.reset();
        this.ModalType = 'ADD'
      }
    }
  }

  selectedData: any = null
  code: any;

  showDialog(){
    this.display = true;
    this.form.reset()
    this.selectedData = null
       this.ModalType = 'ADD'
  
    this.service.getData(this.codeEndpoint).subscribe(
      res =>{
      this.code = res.st_code
      this.form.get('st_code')?.setValue(this.code)
      let username=this.cookie.get('username')
      let modifiedon=this.pipe.transform(this.date, 'yyyy-MM-dd');
      this.form.controls['st_createdon'].setValue(modifiedon);
      this.form.controls['st_createdby'].setValue(username);
      this.form.controls['st_modifiedon'].setValue(modifiedon);
      this.form.controls['st_modifiedby'].setValue(username)
  },
  error => {
    this.closeModal()
    this.messageService.add({ severity: 'error', summary: 'Code Not Generated', detail: 'Failed', life: 5000 });
    console.log("Error")
    }
    )
  }

  editRow(i:any){

    this.selectedData = i;
    this.display = true;  
    this.form.patchValue(this.selectedData)
    this.ModalType = 'UPDATE'
  }
  
  closeModal(){
    this.form.reset();
    this.display = false
  }


// SavaData(Data:any){
//   this.status.push(Data)
// }

// Update(Update:any){
//   const i = this.status.findIndex((user:any) => user.st_code === this.selectedData.st_code);
//   this.status[i] = Update;
// }

Loadtable(){
  this.service.getData('status/data').subscribe((data: any)  =>{
    this.status = data
  });
}

resetCheckbox(){
  this.selected = []
}

OnSubmit(){

  if(this.ModalType==='UPDATE'){
    this.OnUpdate();
  }
  else{
    this.OnSave(this.form.value);
  }
}

 
OnSave(form:any){
  if (this.form.valid) {
    this.service.postData(this.endpoint,this.form.value).subscribe(
      response =>{
        
        // this.SavaData(form)
        this.Loadtable()
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
      
        // this.Update(this.form.value)
        this.Loadtable()
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
    message: 'Are you sure, you want to delete the Selected Status?',
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

// DeleteData(){

//   for (let i = 0; i < this.selected.length; i++) {
//     const code = this.selected[i].st_code;
//     const name = this.selected[i].st_name;

//     this.service.deleteData(this.endpoint, code).subscribe(
//       () => {
        
//         const index = this.status.findIndex((site: any) => site.st_code === code);
//         if (index !== -1) {
//           this.status.splice(index, 1);
//         }
        
//         this.messageService.add({ severity: 'success', summary: 'Deleted', detail: `${name} - Successfully deleted`, life: 4000 });
//       },
//       error => {
  
//         this.messageService.add({ severity: 'error', summary: 'Not Deleted', detail: `${name} - Failed to delete`, life: 4000 });
//         console.error(`Error deleting item with code ${code}:`, error);
//       }
//     );
//   }

//   this.selected = [];
// }
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
    const code = this.selected[i].st_code;
    const name = this.selected[i].st_name;

    this.service.deleteData(this.endpoint, code).subscribe(
      () => {
        deletedCount++;
        const index = this.status.findIndex((site: any) => site.st_code === code);
        if (index !== -1) {
          this.status.splice(index, 1);
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
  }

  this.selected = [];
}
}
