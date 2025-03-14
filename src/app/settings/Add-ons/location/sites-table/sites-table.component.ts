import { Component, Input } from '@angular/core';
import { SettingsService } from '../../service/settings.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sites-table',
  templateUrl: './sites-table.component.html',
  styleUrls: ['./sites-table.component.scss'],
})

export class SitesTableComponent {
  @Input() siteData: any;
 
  sites: any;
  form: any;
  display: boolean = false;

  pipe = new DatePipe('en-US');
  date=new Date();
  close = faCircleXmark

  endpoint="businesslocations/site";  

  constructor(private confirmation: ConfirmationService,private service: SettingsService,private http: HttpClient,private fb:FormBuilder, private messageService: MessageService, private cookie: CookieService){}
  
  ngOnInit(){

    this.form = this.fb.group({
    sc_code:["",Validators.required],
    sc_createdby:["",Validators.required],
    sc_createdon:["",Validators.required],
    sc_name:["",Validators.required],
    // sc_latitude:["",Validators.required],
    // sc_longitude:["",Validators.required],
    sc_notes:["",Validators.required],
    sc_modifiedby:["",Validators.required],
    sc_modifiedon:["",Validators.required],
  });

  // this.service.getData(this.endpoint).subscribe(res =>{  
    // this.sites = res
    // console.log(res)
  //  });

  }

  selected: any = [];
  ModalType = 'ADD'
  codeEndpoint = "sitecode"

ngOnChanges():void{
  this.sites = this.siteData
  
  if(this.selected && this.form){
    this.form.patchValue(this.selected)
    this.ModalType = 'UPDATE'
  }
  else{
    if(this.form){
      this.form.reset();
      this.ModalType = 'ADD'
    }
  }
}

selectedData: any = null
code: any;

showDialog(){
  this.display = true;
  this.form.reset();
  this.selectedData = null
     this.ModalType = 'ADD'

  this.service.getData(this.codeEndpoint).subscribe(
    res =>{
    this.code = res.sc_code
    // console.log("sitecode",this.code)
    this.form.get('sc_code')?.setValue(this.code)
    let username=this.cookie.get('username')
    let modifiedon=this.pipe.transform(this.date, 'yyyy-MM-dd');
    this.form.controls['sc_createdon'].setValue(modifiedon);
    this.form.controls['sc_createdby'].setValue(username);
    this.form.controls['sc_modifiedon'].setValue(modifiedon);
    this.form.controls['sc_modifiedby'].setValue(username)
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
  //   this.sites.push(Data)
  // }
  

  // Update(Update:any){
  //   const i = this.sites.findIndex((user:any) => user.sc_code === this.selectedData.sc_code);
  //   this.sites[i] = Update;
  // }
 
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
          this.sites = [...this.sites, response];
          // this.SavaData(form)
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
  
  
  deleteRow() {
    if (this.selected.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'No Selection', detail: 'Please select at least one row to delete.', life: 4000 });
      return;
    }
 
    this.confirmation.confirm({
      message: 'Are you sure, you want to delete the Selected Site?',
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
      this.sites = data
    });
  }

  // DeleteData(){
 
  //   // Iterate over selected rows
  //   for (let i = 0; i < this.selected.length; i++) {
  //     const code = this.selected[i].sc_code;
  //     const name = this.selected[i].sc_name;
      
  //     this.service.deleteData(this.endpoint, code).subscribe(
  //       () => {
  //         // Remove the deleted row from the sites array
  //         this.sites = this.sites.filter((site: { sc_code: any; }) => site.sc_code !== code);
          
  //         // Show success message
  //         this.messageService.add({ severity: 'success', summary: 'Deleted', detail: `${name} - Successfully  deleted`, life: 4000 });
  //       },
  //       error => {
  //         // Show error message if deletion fails
  //         this.messageService.add({ severity: 'error', summary: 'Not Deleted', detail: `${name} - Failed to delete`, life: 4000 });
  //         console.error("Error deleting row:", error);
  //       }
  //     );
  //   }
  
  //   // Clear the selected rows after processing
  //   this.selected = [];
  // }
  
  resetCheckbox(){
    this.selected = []
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
      const code = this.selected[i].sc_code;
      const name = this.selected[i].sc_name;
  
      this.service.deleteData(this.endpoint, code).subscribe(
        () => {
          deletedCount++;
          const index = this.sites.findIndex((site: any) => site.sc_code === code);
          if (index !== -1) {
            this.sites.splice(index, 1);
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
