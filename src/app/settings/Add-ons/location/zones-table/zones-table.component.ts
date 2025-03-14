import { Component, Input } from '@angular/core';
import { SettingsService } from '../../service/settings.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-zones-table',
  templateUrl: './zones-table.component.html',
  styleUrls: ['./zones-table.component.scss']
})
export class ZonesTableComponent {
  @Input() zoneData: any;
  @Input() siteData: any;

  pipe = new DatePipe('en-US');
  date=new Date();
  zones: any;

  display: boolean = false;

  form: any
  endpoint = "businesslocations/zone"

  sites: any;
  close = faCircleXmark
  
  locations: any;

  constructor(private service: SettingsService,private http: HttpClient,private fb:FormBuilder, private messageService: MessageService, private cookie: CookieService, private confirmation: ConfirmationService)
  {
    // this.SiteLoad()
  }

  SiteLoad(){
    this.service.getData('businesslocations/site').subscribe(res => {
      this.locations = res;
    });
  }

  ngOnInit(){

    this.form=this.fb.group({
      zn_code:["",Validators.required],
      zn_name:["",Validators.required],
      zn_definition:["",Validators.required],
      zn_createdon:["",Validators.required],
      zn_createdby:["",Validators.required],
      zn_areaid:["",Validators.required],
      zn_modifiedby:["",Validators.required],
      zn_modifiedon:["",Validators.required],
      // zn_latitude:["",Validators.required],
      // zn_longitude:["",Validators.required],
    })

  //  this.service.getData(this.endpoint).subscribe(res =>{
  //    this.zones = res
    //  console.log("zones",res)
    // });
 }

  selected: any = [];
  ModalType = 'ADD'
 codeEndpoint = "zonecode"

 ngOnChanges():void{
  this.zones = this.zoneData
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
  this.SiteLoad()
  this.form.reset();
  this.selectedData = null
     this.ModalType = 'ADD'

  this.service.getData(this.codeEndpoint).subscribe(
    res =>{
    this.code = res.zn_code
    this.form.get('zn_code')?.setValue(this.code)
    let username=this.cookie.get('username')
    let modifiedon=this.pipe.transform(this.date, 'yyyy-MM-dd');
    this.form.controls['zn_createdon'].setValue(modifiedon);
    this.form.controls['zn_createdby'].setValue(username);
    this.form.controls['zn_modifiedon'].setValue(modifiedon);
    this.form.controls['zn_modifiedby'].setValue(username)
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
  this.SiteLoad()
  this.display = true;  

  let username = this.cookie.get('username')
  let modifiedon = this.pipe.transform(this.date, 'yyyy-MM-dd');

  let zn_modifiedby = username 
  let zn_modifiedon = modifiedon 

// console.log(i)
  const patchcode =  this.selectedData.zn_code;
  const zname = this.selectedData.zn_name;
  const def =  this.selectedData.zn_definition;
  const areaid =  this.selectedData.zn_areaid.sc_id;
  const createon = this.selectedData.zn_createdon;
  const creatby = this.selectedData.zn_createdby;
  const modon =  zn_modifiedon
  const modby =  zn_modifiedby

  this.form.patchValue({
    zn_code: patchcode,
    zn_name: zname,
    zn_definition: def, 
    zn_areaid: areaid,
    zn_createdon: createon,
    zn_createdby: creatby,
    zn_modifiedon: modon,
    zn_modifiedby: modby

  })
  this.ModalType = 'UPDATE'
}

closeModal(){
  this.form.reset();
  this.display = false
}


//  SavaData(Data:any){
//   this.zones.push(Data)
// }

// Update(Update:any){
//   const i = this.zones.findIndex((user:any) => user.zn_code === this.selectedData.zn_code);
//   this.zones[i] = Update;

// }

Loadtable(){
  this.service.getData('businesslocations/zone').subscribe((data: any[])  =>{
    this.zones = data
  });
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

deleteRow() {
  if (this.selected.length === 0) {
    this.messageService.add({ severity: 'warn', summary: 'No Selection', detail: 'Please select at least one row to delete.', life: 4000 });
    return;
  }

  this.confirmation.confirm({
    message: 'Are you sure, you want to delete the selected Zone?',
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
    const code = this.selected[i].zn_code;
    const name = this.selected[i].zn_name;

    this.service.deleteData(this.endpoint, code).subscribe(
      () => {
        deletedCount++;
        const index = this.zones.findIndex((site: any) => site.cdn_code === code);
        if (index !== -1) {
          this.zones.splice(index, 1);
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

// DeleteData(){

//   // Loop through selected items
//   for (let i = 0; i < this.selected.length; i++) {
//     const code = this.selected[i].zn_code;
//     const name = this.selected[i].zn_name;

//     // Perform deletion for each selected item
//     this.service.deleteData(this.endpoint, code).subscribe(
//       () => {
//         // Remove the deleted item from the sites array
//         const index = this.zones.findIndex((site: any) => site.zn_code === code);
//         if (index !== -1) {
//           this.zones.splice(index, 1);
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

//   // Clear the selection after all deletions
//   this.selected = [];
// }

resetCheckbox(){
  this.selected = []
}


}

 

