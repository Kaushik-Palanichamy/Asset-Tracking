import { Component, Input } from '@angular/core';
import { SettingsService } from '../service/settings.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DashboardService } from 'src/app/dashboard/service/dashboard.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-plant-management',
  templateUrl: './plant-management.component.html',
  styleUrls: ['./plant-management.component.scss']
})
export class PlantManagementComponent {
  @Input() plantData: any;
  @Input() userData: any;
  @Input() readerData: any;

  loading: boolean = false
  plantManagement: any ;

  Addform: any;
  Editform: any
submitted = '';
  display: boolean = false;
  Editpopup: boolean = false;
  endpoint = "plantmanagement/data"

  bcnDetails: any;
  userManagement: any
  readerManagement: any;

  constructor(private dashboardservice: DashboardService,private service: SettingsService,private http: HttpClient,private fb:FormBuilder, private messageService: MessageService)
    {
     
    }



  ngOnInit(){   

    // this.GetData()

      this.Addform = this.fb.group({
      pmcode: ['', Validators.required],
      pmmaxusers: ['', Validators.required],
      pmcompanyname: ['', Validators.required],
      pmmaxsites: ['', Validators.required],
      pmmaxarea: ['', Validators.required],
      pmmaxzone: ['', Validators.required],
      pmmaxgateway: ['', Validators.required],
      pmmaxbeacons: ['', Validators.required]
    })
  }


  updateTable(){
    this.loading = true
    this.service.getData(this.endpoint).subscribe(res =>{
      this.plantManagement = res
      this.loading = false
    })
  }


  GetData(){
    this.loading = true
    this.plantManagement = this.plantData
    this.loading = false

  // forkJoin({
  //   userManagement: this.service.getData('usermanagement/data'),
  //   bcnDetails: this.dashboardservice.postdata('overview/assets_count'),
  //   readerManagement: this.service.getData('reader/data'),
  //   plantManagement: this.service.getData(this.endpoint),
  // }).subscribe({
  //   next: ({ userManagement, bcnDetails, readerManagement, plantManagement }) => {
  //     // Update plantManagement with additional properties
  //     this.plantManagement = plantManagement.map((data: any) => ({
  //       ...data,
  //       pmmaxsites: bcnDetails[0]?.nofsites,
  //       pmmaxarea: bcnDetails[0]?.nofareas,
  //       pmmaxzone: bcnDetails[0]?.nofzones,
  //       pmmaxbeacons: bcnDetails[0]?.nofitems,
  //       pmmaxusers: userManagement.length,
  //       pmmaxgateway: readerManagement.length,
  //     }));
  
  //     console.log("Updated Plant Management:", this.plantManagement);
  //   },
  //   error: (error) => {
  //     console.error('Error fetching data:', error);
  //   },
  // });
 }

  selected: any = [];
  ModalType = 'ADD'
  
  ngOnChanges():void{

    this.plantManagement = this.plantData
    this.GetData();
    if(this.selected && this.Addform){
      this.Addform.patchValue(this.selected)
      this.ModalType = 'UPDATE'
    }
    else{
      if(this.Addform){
        this.Addform.reset();
        this.ModalType = 'ADD'
      }
    }
  }



  codeEndpoint = 'pmcode'
  code: any;
  selectedData: any = null



  showDialog(){
    this.display = true;
     this.selectedData = null
    this.ModalType = 'ADD'
    this.service.getData('pmcode').subscribe(
      res =>{
        // console.log("res",res)
       this.code = res
      this.Addform.get('pmcode')?.setValue(this.code)
    },
    error => {
      this.closeModal()
      this.messageService.add({ severity: 'error', summary: 'Code Not Generated', detail: 'Failed', life: 5000 });
      console.log("Error")
    })
  }

  closeModal(){
    this.Addform.reset();
    this.display=false
  }

  editRow(i:any){
    this.selectedData = i;
    this.display = true;  
    this.Addform.patchValue(this.selectedData)
    this.ModalType = 'UPDATE'
  }
  
  SavaData(Data:any){
    this.plantManagement.push(Data)
  }

  Update(Update:any){
    const i = this.plantManagement.findIndex((user:any) => user.pmcode === this.selectedData.pmcode);
    this.plantManagement[i] = Update;
  }

  OnSubmit(){

    this.Addform.controls['pmcode'].setValue(this.code);
  
    if(this.ModalType==='UPDATE'){
      this.OnUpdate();
    }
    else{
      this.OnSave(this.Addform.value);
    }
  
  }
  
  OnSave(form:any){
    if (this.Addform.valid) {
      this.service.postData(this.endpoint,this.Addform.value).subscribe(
        response =>{
          
          this.SavaData(form)
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
        
          this.Update(this.Addform.value)
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
    for (let i = 0; i < this.selected.length; i++){
      const code = this.selected[i].pmcode;
      // console.log(i)
      this.service.deleteData(this.endpoint, code).subscribe(
        () => {
          const index = this.plantManagement.findIndex((j:any) => j.pmcode === code);
          if (index !== -1) {
   
            this.plantManagement.splice(index, 1);
            this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Successfully', life: 4000 });
          }
        },
        error => {
    
          this.messageService.add({ severity: 'error', summary: 'Not Deleted', detail: 'Failed', life: 4000 });
          console.log("Error");
        }
      );
    
    this.selected = [];
    }
  }
}
