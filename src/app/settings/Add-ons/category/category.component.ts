import { Component, Input } from '@angular/core';
import { SettingsService } from '../service/settings.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
@Input() categoryData: any;
category: any;
public icon: string = '../../../../assets/icons/Table/Available.png';

form: any;
display: boolean = false;
close = faCircleXmark
pipe = new DatePipe('en-US');
date=new Date();

endpoint ='category/data'
constructor(private service: SettingsService,private http: HttpClient,private fb:FormBuilder, private messageService: MessageService,private cookie: CookieService,private confirmation: ConfirmationService)
{

  // this.service.getData(this.endpoint).subscribe(res =>{
  //   this.category = res
    // console.log("category",res)
  // });
  this.form=this.fb.group({
   cm_code:["",Validators.required],
   cm_name:["",Validators.required],
   cm_unitname:["",Validators.required],
   cm_active:[false,Validators.required],
   cm_createdon:["",Validators.required],
   cm_notes:["",Validators.required],
  //  cm_maintenance_parameters: [""],
   cm_vendorname: [""]

 });
}

ngOnInit(){

  
}

selected: any = [];
ModalType = 'ADD'
codeEndpoint = "cccode"

ngOnChanges():void{

  this.category = this.categoryData
  
  if(this.selected){
    this.form.patchValue(this.selected)
    this.ModalType = 'UPDATE'
  }
  else{
    this.form.reset();
    this.ModalType = 'ADD'
  }
}

selectedData: any = null
code: any;

ShowDialog(){
  this.display = true;
  this.form.reset();
  this.selectedData = null
     this.ModalType = 'ADD'

  this.service.getData(this.codeEndpoint).subscribe(
    res =>{
    this.code = res.cm_code
    this.form.get('cm_code')?.setValue(this.code)
    let username=this.cookie.get('username')
    let modifiedon=this.pipe.transform(this.date, 'yyyy-MM-dd');
    this.form.controls['cm_createdon'].setValue(modifiedon);
    // this.form.controls['cm_createdby'].setValue(username);
    // this.form.controls['cm_modifiedon'].setValue(modifiedon);
    this.form.controls['cm_maintenance_parameters'].toString();
    // this.form.controls['cm_modifiedby'].setValue(username)
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
  //   this.category.unshift(Data)
  // }
  

  // Update(Update:any){
  //   const i = this.category.findIndex((user:any) => user.cm_code === this.selectedData.cm_code);
  //   this.category[i] = Update;
  // }
 
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
          this.category = [...this.category, response];
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
        
          this.Loadtable();
          // this.Update(this.form.value)
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
      message: 'Are you sure, you want to delete the selected Category?',
      header: 'Delete Confirmation', 
      icon: 'pi pi-exclamation-circle',
      acceptButtonStyleClass:"p-button-danger p-button-text",
      rejectButtonStyleClass:"p-button-text p-button-text",
      acceptIcon:"none",
      rejectIcon:"none",
      accept: () => {
        this.DeleteData();
        this.Loadtable();
      }
      
    });

  }

  // DeleteData(){

  //   // Loop through selected items
  //   for (let i = 0; i < this.selected.length; i++) {
  //     const code = this.selected[i].cm_code;

  //     const name = this.selected[i].cm_name;
  
  //     // Perform deletion for each selected item
  //     this.service.deleteData(this.endpoint, code).subscribe(
  //       () => {
  //         // Remove the deleted item from the sites array
  //         const index = this.category.findIndex((site: any) => site.cm_code === code);
  //         if (index !== -1) {
  //           this.category.splice(index, 1);
  //         }
  //         // Optionally, show success message for each deletion
  //         this.messageService.add({ severity: 'success', summary: 'Deleted', detail: `${name} - Successfully deleted`, life: 4000 });
  //       },
  //       error => {
  //         // Show error message if deletion fails
  //         this.messageService.add({ severity: 'error', summary: 'Not Deleted', detail: `${name} - Failed to delete`, life: 4000 });
  //         console.error(`Error deleting item with code ${name}:`, error);
  //       }
  //     );
  //   }
  
  //   // Clear the selection after all deletions
  //   this.selected = [];
  // }

  Loadtable(){
    this.service.getData('category/data').subscribe((data: any[])  =>{
      this.category = data
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
      const code = this.selected[i].cm_code;
      const name = this.selected[i].cm_name;
  
      this.service.deleteData(this.endpoint, code).subscribe(
        () => {
          deletedCount++;
          const index = this.category.findIndex((site: any) => site.cm_code === code);
          if (index !== -1) {
            this.category.splice(index, 1);
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
