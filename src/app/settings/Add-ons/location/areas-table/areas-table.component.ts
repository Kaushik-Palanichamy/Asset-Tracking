import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { SettingsService } from '../../service/settings.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-areas-table',
  templateUrl: './areas-table.component.html',
  styleUrls: ['./areas-table.component.scss']
})
export class AreasTableComponent {
@Input() areaData: any;
@Input() siteData: any;
  areas: any;

  display: boolean = false;
  
  form: any;
  editform: any;

  endpoint = "businesslocations/area"
  pipe = new DatePipe('en-US');
  date=new Date();
  sites: any;
  close = faCircleXmark

  constructor( private confirmation: ConfirmationService, private service: SettingsService,private http: HttpClient,private fb:FormBuilder, private messageService: MessageService, private cookie: CookieService)
  {
    // this.SiteLoad()
  }

  SiteLoad(){
    this.service.getData('businesslocations/site').subscribe(res => {
      this.sites = res;
    });
  }

  ngOnInit(){
    this.form=this.fb.group({
      ar_code:["",Validators.required],
      ar_name:["",Validators.required],
      // ar_createdby:["",Validators.required],
      // ar_createdon:["",Validators.required],
      ar_sitekey:["",Validators.required],
      ar_country:["",Validators.required],
      ar_floor:["",Validators.required],
      ar_image:[""],
      ar_latitude:["",Validators.required],
      ar_longitude:["",Validators.required],
      ar_city:["",Validators.required],
      ar_state:["",Validators.required],
      ar_zipcode:["",Validators.required],
      // ar_relatedzones:[""],

    });

  //  this.service.getData(this.endpoint).subscribe(res =>{
  //    this.areas = res
    //  console.log(res)
    // });

    // this.service.getData("businesslocations/site").subscribe(res =>{
    //   this.sites = res  
    // });
  }

  selected: any = [];
  ModalType = 'ADD'
  codeEndpoint = "areacode"

  ngOnChanges():void{
    this.areas = this.areaData
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
  this.form.reset()
  this.selectedData = null
     this.ModalType = 'ADD'

  this.service.getData(this.codeEndpoint).subscribe(
    res =>{
    this.code = res.ar_code

    this.form.get('ar_code')?.setValue(this.code)
    let username=this.cookie.get('username')
    let modifiedon=this.pipe.transform(this.date, 'yyyy-MM-dd');
    // this.form.controls['ar_createdby'].setValue(username);
    // this.form.controls['ar_createdon'].setValue(modifiedon);
    this.form.controls['ar_image'].setValue("0");
    // this.form.controls['ar_relatedzones'].setValue("0");
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

  const patchcode =  this.selectedData.ar_code
  const aname = this.selectedData.ar_name
  const sitekey =  this.selectedData.ar_sitekey.sc_id;
  const country =  this.selectedData.ar_country;
  const floor =  this.selectedData.ar_floor
  const image =  this.selectedData.ar_image
  const lati =  this.selectedData.ar_latitude
  const longi =  this.selectedData.ar_longitude
  const city =  this.selectedData.ar_city
  const state =  this.selectedData.ar_state
  const zip =  this.selectedData.ar_zipcode
  // const relzone =  this.selectedData.ar_relatedzones
  // const createon = this.selectedData.ar_createdon
  // const creatby = this.selectedData.ar_createdby

  this.form.patchValue({
    ar_code: patchcode,
    ar_name: aname,
    ar_sitekey: sitekey,
    ar_country: country,
    ar_floor: floor,
    ar_image: image,
    ar_latitude: lati,
    ar_longitude: longi,
    ar_city: city, 
    ar_state: state,
    ar_zipcode: zip,
    // ar_relatedzones: relzone,
    // ar_createdon: createon,
    // ar_createdby: creatby,
  })

  this.ModalType = 'UPDATE'
}

closeModal(){
  this.form.reset();
  this.display = false
}

// SavaData(Data:any){
//   this.areas.push(Data)
// }


// Update(Update:any){
//   const i = this.areas.findIndex((user:any) => user.ar_code === this.selectedData.ar_code);
//   this.areas[i] = Update;
// }

Loadtable(){
  this.service.getData('businesslocations/area').subscribe((data: any[])  =>{
    this.areas = data
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
      message: 'Are you sure, you want to delete the selected Area?',
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
      const code = this.selected[i].ar_code;
      const name = this.selected[i].ar_name;
  
      this.service.deleteData(this.endpoint, code).subscribe(
        () => {
          deletedCount++;
          const index = this.areas.findIndex((site: any) => site.cdn_code === code);
          if (index !== -1) {
            this.areas.splice(index, 1);
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
  //     const code = this.selected[i].ar_code;
  //     const name = this.selected[i].ar_name;
  
  //     // Perform deletion for each selected item
  //     this.service.deleteData(this.endpoint, code).subscribe(
  //       () => {
  //         // Remove the deleted item from the sites array
  //         const index = this.areas.findIndex((area: { ar_code: any; }) => area.ar_code === code);
  //         if (index !== -1) {
  //           this.areas.splice(index, 1);
  //         }
  //         // Optionally, show success message for each deletion
  //         this.messageService.add({ severity: 'success', summary: 'Deleted', detail: ` ${name} - Successfully deleted `, life: 4000 });
  //       },
  //       error => {
  //         // Show error message if deletion fails
  //         this.messageService.add({ severity: 'error', summary: 'Not Deleted', detail: ` ${name} - Failed to delete`, life: 4000 });
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
