import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { SettingsService } from '../service/settings.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.scss']
})
export class ConditionsComponent implements OnInit, OnChanges {
  @Input() conditionsData: any;
  conditions: any  
  form: any;               
  display: boolean = false;

  pipe = new DatePipe('en-US');
  date = new Date();

  endpoint = "condition/data";
  visible: boolean = false;
  close = faCircleXmark
  icons: any[]|undefined;

  constructor(
    private service: SettingsService,
    private http: HttpClient,
    private fb: FormBuilder,
    private messageService: MessageService,
    private cookie: CookieService,
    private confirmation: ConfirmationService
  ) 
  {
    // this.service.getData(this.endpoint).subscribe(res=>{
    //   this.conditions = res;
    // });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      cdn_name: ["", Validators.required],
      cdn_icon: ["0"],  // Default value for icon
      cdn_code: ["", Validators.required],
      cdn_active: [false, Validators.required],
      cdn_createdby: ["", Validators.required],
      cdn_createdon: ["", Validators.required],
      cdn_modifiedon: ["", Validators.required],
      cdn_modifiedby: ["", Validators.required]
    });
  }

  selected: any = [];
  ModalType = 'ADD'  
  codeEndpoint = "cdncode";

  ngOnChanges(): void {
    this.conditions = this.conditionsData
    
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
  code: any ;

  showDialog(): void {
    this.display = true;
    this.form.reset()
    this.selectedData = null;
    this.ModalType = 'ADD';

    this.service.getData(this.codeEndpoint).subscribe(
      res =>{
        this.code = res.cdn_code;
        this.form.get('cdn_code')?.setValue(this.code);
        this.form.controls['cdn_code'].setValue(this.code); 
        let username = this.cookie.get('username');
        let modifiedon = this.pipe.transform(this.date, 'yyyy-MM-dd');
       
      this.form.controls['cdn_createdon'].setValue(modifiedon);
      this.form.controls['cdn_createdby'].setValue(username);
      this.form.controls['cdn_modifiedon'].setValue(modifiedon);
      this.form.controls['cdn_modifiedby'].setValue(username)
      },
      error => {
        this.closeModal();
        this.messageService.add({ severity: 'error', summary: 'Code Not Generated', detail: 'Failed', life: 5000 });
        console.error("Error generating code:", error);
      }
    );
  }

  editRow(i: any) {
    this.selectedData = i;
    this.display = true;
    this.form.patchValue(this.selectedData);
    this.ModalType = 'UPDATE';
  }

  closeModal() {
    this.form.reset();
    this.display = false;
  }

  // SavaData(data: Condition): void {
  //   this.conditions.push(data);
  // }

  // Update(update: Condition): void {
  //   const index = this.conditions.findIndex((user: Condition) => user.cdn_code === this.selectedData?.cdn_code);
  //   if (index !== -1) {
  //     this.conditions[index] = update;
  //   }
  // }

  Loadtable(){
    this.service.getData('condition/data').subscribe((data: any[])  =>{
      this.conditions = data
    });
  }

  resetCheckbox(){
    this.selected = []
  }
  
  OnSubmit(): void {
    if(this.ModalType==='UPDATE'){
      this.OnUpdate();
      // this.Loadtable()
    }
    else{
      this.OnSave(this.form.value);
      
    }
  }

  OnSave(form:any){
    if (this.form.valid) {
      this.service.postData(this.endpoint, this.form.value).subscribe(
        response => {
          // this.SavaData(form);
          this.conditions = [...this.conditions, response];
          this.form.reset();
          this.closeModal();
          this.messageService.add({ severity: 'success', summary: 'Added', detail: 'Successfully', life: 4000 });
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Failed to Add', detail: 'Failed', life: 4000 });
          console.error("Error saving data:", error);
        }
      );
    }
  }

  OnUpdate(): void {
    if (this.selectedData) {
      this.service.putData(this.endpoint, this.form.value).subscribe(
        update => {
          // this.Update(this.form.value);
          this.Loadtable()
          this.closeModal();
          this.messageService.add({ severity: 'info', summary: 'Updated', detail: 'Successfully', life: 4000 });
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Not Updated', detail: 'Failed', life: 4000 });
          console.error("Error updating data:", error);
        }
      );
    }
  }

  deleteRow() {
    if (this.selected.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'No Selection', detail: 'Please select at least one row to delete.', life: 4000 });
      return;
    }

    this.confirmation.confirm({
      message: 'Are you sure, you want to delete the selected Condition?',
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
      const code = this.selected[i].cdn_code;
      const name = this.selected[i].cdn_name;
  
      this.service.deleteData(this.endpoint, code).subscribe(
        () => {
          deletedCount++;
          const index = this.conditions.findIndex((site: any) => site.cdn_code === code);
          if (index !== -1) {
            this.conditions.splice(index, 1);
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
      this.Loadtable()
      
    }
  
    this.selected = [];
  }
  
}
