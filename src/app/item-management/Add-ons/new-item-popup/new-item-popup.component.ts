import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemManagementService } from '../service/item-management.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-new-item-popup',
  templateUrl: './new-item-popup.component.html',
  styleUrls: ['./new-item-popup.component.scss']
})
export class NewItemPopupComponent {
  form!: any;
  submitted = false;
  categories: any;
  conditions: any;
  status: any;
  locations: any;

  MacAddress: any=[];
  


constructor(private service: ItemManagementService,private fb: FormBuilder,public dialogService: DialogService) 
{ 
  // this.service.getData('itemdetails').subscribe(res =>{  
  //   this.categories=res.category
  //   this.conditions=res.condition  
  //   this.status=res.status
  //   this.locations=res.location
  // });

}

ngOnInit() {
  this.form = this.fb.group({
    im_code           : [''],
    im_name           : ['', Validators.required],
    im_assetcode      : ['', Validators.required],
    im_beaconid       : ['', Validators.required],
    im_categoryid     : ['', Validators.required],
    im_conditionid    : ['', Validators.required],
    im_statusid       : ['', Validators.required],
    im_zonecurrentid  : ['', Validators.required],
    im_zonehomeid     : ['', Validators.required],
    br_itemdesc       : ['', Validators.required],
    br_lastservice    : ['', Validators.required],
    wr_expireson      : ['', Validators.required],
    purchaseDate      : [''],
    purchaseFrom      : [''],
    warrantyPeriod    : [''],
    purchaseCost      : [''],
    replacementCost   : [''],
    purchaseOrder     : [''],
    lastAuditDate     : [''],
    auditBy           : [''],
    nextAudit         : [''],
    AssignTo          : [''],
    sendMail          : [''],
    auditReport       : [''],
    createdOn         : [''],
    createdBy         : [''],
    modifiedOn        : [''],
    modifiedBy        : [''],
    lastCapturedOn    : [''],
    macadd            : [''],
    
  });
  
  
}

AddMacAddress(){

}
OnSubmit(){
  console.log(this.form.value)
}
}
