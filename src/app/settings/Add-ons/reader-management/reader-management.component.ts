import { Component, Input } from '@angular/core';
import { SettingsService } from '../service/settings.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { UUID } from 'angular2-uuid';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-reader-management',
  templateUrl: './reader-management.component.html',
  styleUrls: ['./reader-management.component.scss']
})
export class ReaderManagementComponent {
  @Input() readerData: any;
  @Input() conditionData: any;
  @Input() statusData: any;
  @Input() zoneData: any;

  
  date = new Date()
  pipe = new DatePipe('en-US');
  
  // show:boolean=true;

  readerManagement: any;
  Addform: any
  Editform: any;

  display: boolean=false;
  endpoint: any;
 
  conditions: any;
  status: any
  zones: any;
  spots: any;
  selectedspot : string = ''
  close = faCircleXmark
  
  constructor(private service: SettingsService,private http: HttpClient,private fb:FormBuilder, private messageService: MessageService,private cookie:CookieService, private confirmation: ConfirmationService ,)
  {
    // this.loadConditions()
    // this.loadStatus()
    // this.loadZones()

    this.spots = [
      { name: 'Inward', code: 'Inward' },
      { name: 'Outward', code: 'Outward' }, 
  ]
  }

  

  loadConditions() {
    this.service.getData('condition/data').subscribe(res => {
      this.conditions = res;
    });
  }

  loadStatus() {
    this.service.getData('status/data').subscribe(res => {
      this.status = res;
    });
  }

  loadZones() {
    this.service.getData('businesslocations/zone').subscribe(res => {
      this.zones = res;
    });
  }

  ngOnInit(){
    this.generateUUID()

    this.endpoint = "reader/data"
    // this.show = true
    //  this.service.getData(this.endpoint).subscribe(res =>{
      // this.show = false
      //  this.readerManagement = res
      //  console.log("one",this.readerManagement)
    //  });

   
     
     this.Addform=this.fb.group({
       bg_statusid:["",Validators.required],
       bg_code:["",Validators.required],
       bg_manufacturer:["",Validators.required],
       bg_webkey:["",Validators.required],
       bg_conditionid:["",Validators.required],
       bg_zoneid:["",Validators.required],
       bg_gatewayname:["",Validators.required],
       bg_macaddress:["",Validators.required],
       bg_createdon:["",Validators.required],
       bg_createdby:["",Validators.required],
       bg_modifiedon:["",Validators.required],
       bg_modifiedby:["",Validators.required],
       bg_lastupdt:["",Validators.required],
       bg_inorout:["",Validators.required]
     });

    
  }

  selected: any = [];
  ModalType = 'ADD'

ngOnChanges():void{

  this.conditions = this.conditionData
  this.status = this.statusData
  this.zones = this.zoneData
 this.readerManagement = this.readerData

  if(this.selected  && this.Addform){
    this.Addform.patchValue(this.selected)
    this.ModalType = 'UPDATE'
  }
  else{

    if (this.Addform) {
      this.Addform.reset();
      this.ModalType = 'ADD'
    }
  }
  this.selected = [];
}

 uuidValue: any;

generateUUID(){
  this.uuidValue = UUID.UUID();
  return this.uuidValue;
}


selectedData: any = null
codeEndpoint ="rdrcode"
code: any;

showDialog(){
  this.display = true;
  this.Addform.reset()

  this.loadConditions()
  this.loadStatus()
  this.loadZones()

  this.selectedData = null
  this.ModalType = 'ADD'

  this.service.getData(this.codeEndpoint).subscribe(
    res =>{
      // console.log("RM",res)
      this.code = res.bg_code
    this.Addform.get('bg_code')?.setValue(this.code) 
    this.Addform.controls['bg_code'].setValue(this.code); 
    
    let username=this.cookie.get('username')
  let modifiedon=this.pipe.transform(this.date, 'yyyy-MM-dd');
  this.Addform.controls['bg_createdon'].setValue(modifiedon);
  this.Addform.controls['bg_createdby'].setValue(username);
  this.Addform.controls['bg_modifiedon'].setValue(modifiedon);
  this.Addform.controls['bg_modifiedby'].setValue(username);
  this.Addform.controls['bg_webkey'].setValue(this.uuidValue);
  this.Addform.controls['bg_lastupdt'].setValue( this.date);
  },
  error => {
    this.closeModal()
    this.messageService.add({ severity: 'error', summary: 'Code Not Generated', detail: 'Failed', life: 5000 });
    console.log("Error")
  })
}

  
closeModal(){
  this.Addform.reset();
  this.display = false
}

editRow(i:any){
  this.selectedData = i;
  // console.log(this.selectedData)
  this.display = true;  
  const statusId = this.selectedData.bg_statusid.st_id;
  const zoneId = this.selectedData.bg_zoneid.zn_id;
  const conditionId = this.selectedData.bg_conditionid.cdn_id;
  const patchcode = this.selectedData.bg_code;
  const manf =  this.selectedData.bg_manufacturer;
  const web =  this.selectedData.bg_webkey; 
  const gate =  this.selectedData.bg_gatewayname;
  const mac =  this.selectedData.bg_macaddress;
  const createon = this.selectedData.bg_createdon;
  const creatby = this.selectedData.bg_createdby;
  const modon = this.selectedData.bg_modifiedon;
  const modby =  this.selectedData.bg_modifiedby;
  const lstupd = this.selectedData.bg_lastupdt;
  const inout =  this.selectedData.bg_inorout;

  this.Addform.patchValue({   
    bg_code: patchcode,
    bg_manufacturer: manf,
    bg_webkey: web,
    bg_gatewayname: gate,
    bg_macaddress: mac,
    bg_createdon: createon,
    bg_createdby: creatby,
    bg_modifiedon: modon,
    bg_modifiedby: modby,
    bg_lastupdt: lstupd,
    bg_inorout: inout,
    bg_statusid: statusId,
    bg_zoneid: zoneId,
    bg_conditionid: conditionId
  })
  this.ModalType = 'UPDATE'
}


// SavaData(Data:any){
//   this.readerManagement.push(Data)
// }

// Update(Update:any){
//   const i = this.readerManagement.findIndex((user:any) => user.bg_code === this.selectedData.bg_code);
//   this.readerManagement[i] = Update;
// }


Loadtable(){
  this.service.getData('reader/data').subscribe((data: any[])  =>{
    this.readerManagement = data
  });
}

resetCheckbox(){
  this.selected = []
}

  OnSubmit(){
   

    if(this.ModalType==='UPDATE'){
      this.OnUpdate();
      // this.Loadtable()
    }
    else{
      this.OnSave(this.Addform.value);
      
    }
    
  }
 
  OnSave(form:any){
    if (this.Addform.valid) {
      this.service.postData(this.endpoint,this.Addform.value).subscribe(
        response =>{
         
          // this.SavaData(form)
          this.Loadtable()
          this.Addform.reset();
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
  
      this.service.putData(this.endpoint, this.Addform.value).subscribe(
        update =>{
        
          // this.Update(this.Addform.value)
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

  // deleteRow(i:any){
 
  //   for (let i = 0; i < this.selected.length; i++){
  //     const code = this.selected[i].bg_code;
  //     console.log(code)
  //     this.service.DeleteData(this.endpoint, code).subscribe(
  //       () => {
  //         const index = this.readerManagement.findIndex((j:any) => j.bg_code === code);
  //         if (index !== -1) {
   
  //           this.readerManagement.splice(index, 1);
  //           this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Successfully', life: 4000 });
  //         }
  //       },
  //       error => {
    
  //         this.messageService.add({ severity: 'error', summary: 'Not Deleted', detail: 'Failed', life: 4000 });
  //         console.log("Error");
  //       }
  //     );
    
  //   this.selected = [];
      
  //   }
    
  
  // }
  deleteRow() {
    if (this.selected.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'No Selection', detail: 'Please select at least one row to delete.', life: 4000 });
      return;
    }
    
    this.confirmation.confirm({
      message: 'Are you sure, you want to delete the selected Gateway?',
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
      const code = this.selected[i].bg_code;
      const name = this.selected[i].bg_name;
  
      this.service.deleteData(this.endpoint, code).subscribe(
        () => {
          deletedCount++;
          const index = this.readerManagement.findIndex((site: any) => site.cdn_code === code);
          if (index !== -1) {
            this.readerManagement.splice(index, 1);
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
  //     const code = this.selected[i].bg_code;
  //     const name = this.selected[i].bg_name;
  
  //     // Perform deletion for each selected item
  //     this.service.deleteData(this.endpoint, code).subscribe(
  //       () => {
  //         // Remove the deleted item from the sites array
  //         const index = this.readerManagement.findIndex((site: any) => site.bg_code === code);
  //         if (index !== -1) {
  //           this.readerManagement.splice(index, 1);
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


}
