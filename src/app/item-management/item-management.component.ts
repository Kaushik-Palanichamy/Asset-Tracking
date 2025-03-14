import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ItemManagementService } from './Add-ons/service/item-management.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NewItemPopupComponent } from './Add-ons/new-item-popup/new-item-popup.component';
import { Table } from 'primeng/table';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { SettingsService } from '../settings/Add-ons/service/settings.service';
import * as XLSX from "xlsx-js-style";
// import * as xlsx from "xlsx";
import { faArrowRotateForward, faBatteryEmpty, faBatteryFull, faCartArrowDown, faCartFlatbedSuitcase, faCheck, faChevronCircleDown, faCircleXmark, faCloudArrowUp, faCloudUpload, faEye, faEyeLowVision, faMobile, faMoneyBill1, faMoneyBill1Wave, faMoneyBills, faNewspaper, faPenToSquare, faPersonDigging, faPlus, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { CookieService } from 'ngx-cookie-service';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import {  faTemperatureHigh } from '@fortawesome/free-solid-svg-icons';
import { faBatteryThreeQuarters } from '@fortawesome/free-solid-svg-icons';
import { DatePipe } from '@angular/common';
import { urlComponent } from '../url'


@Component({
  selector: 'app-item-management',
  templateUrl: './item-management.component.html',
  styleUrls: ['./item-management.component.scss'],

})
export class ItemManagementComponent implements OnChanges {
    // Explicitly declare the type for the map with string | null
    selectedFileNameMap: { [key: string]: string | null } = {
      im_liveimage: null,
      im_purchaseOrder: null,
      im_auditreport: null
    };

    // Server file name map without nulls
    serverFileNameMap: { [key: string]: string } = {
      im_liveimage: '',
      im_purchaseOrder: '',
      im_auditreport: ''
    };

  @ViewChild('dt') dt!: ElementRef;
  // @ViewChild('liveimagetext')inputimageText!: ElementRef;
  @ViewChild('dt', { static: false }) dtt!: Table;
  url = new urlComponent().url

  uploadss = faCloudUpload
  // text:any
  dataChanged:any=true
  eye = faEye

  pl = sessionStorage.getItem('currentplant') || ''

  backendUrl =  this.url + localStorage.getItem(this.pl) + '/' +'item/data/';   //'http://13.202.26.179:8002/item/media/';
  // backendUrl1 = this.url + localStorage.getItem(this.pl) + '/' +'item/upload/'; //'http://13.202.26.179:8002/item/upload/';
  backendUrl2 = this.url + localStorage.getItem(this.pl) + '/' +'item/edit/';  //'http://13.202.26.179:8002/item/edit/';

  date = new Date();
  pipe= new DatePipe("en-US")

  temperature = faTemperatureHigh;
  battery = faBatteryThreeQuarters;
  batteryfull = faBatteryFull
  batteryempty = faBatteryEmpty
  
  DataView!: any[];
  DataViewtype: any;

  check = faCheck
  cross = faXmark
  down = faChevronCircleDown
  reset = faArrowRotateForward
  add = faPlus
  del = faTrash
  edit = faPenToSquare
  cloud = faCloudArrowUp
  close = faCircleXmark
  purchaseHistory = faCartArrowDown
  audit = faMoneyBills
  overview = faNewspaper

  ModalType = 'ADD'
  defaultValue: string = '';

  public file: File | null = null;
  public file1: File | null = null;
  public file2: File | null = null;
  uploadInProgress: boolean = false;
  uploadProgress: number = 0;

  // selectedItem: any = [];
  tableData: any;
  loading: boolean = true;
  ref!: DynamicDialogRef;
  showtable:boolean=true;

  public SelectedCategory: string = ''
  public SelectedStatus: string = ''
  public SelectedCurrLoc: string = ''
  public SelectedHomeLoc: string = ''
  public SelectedCondi: string = ''

  selectedFileName: string | null = null;
  selectedFileName1: string | null = null;
  selectedFileName2: string | null = null;

  categories: any;
  conditions: any;
  status: any;
  locations: any;

  MacAddress: any=[];
  Addform: any;
  item : any;
  itemDialog: boolean = false;

  endpoint ='item/data'

  actionRow: MenuItem[] | any;
  selectedItems: any[] = [];
  serverFileName: string | null = null;
  serverFileName1: string | null = null;
  serverFileName2: string | null = null;
// Define a type for your fileNameMap keys
fileNameMap: Record<'im_auditreport' | 'im_purchaseOrder' | 'im_liveimage', string | null> = {
  im_auditreport: null,
  im_purchaseOrder: null,
  im_liveimage: null
};
isFileSelected = false;
  liveimageFile: File | null = null;
  purchaseOrderFile: File | null = null;
  auditreportFile: File | null = null;

  maxDate: string;
minDate: any
  text: string = '';
  text1: string = '';
  text2: string = '';
  // A simple method to check if the input text is a valid URL
  isValidUrl(text: string): boolean {
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return urlPattern.test(text);
  }

 

  constructor(private settingservice: SettingsService,private service: ItemManagementService, private messageService: MessageService,private http: HttpClient,private fb: FormBuilder, private Cookie: CookieService, private confirmation: ConfirmationService,private cd: ChangeDetectorRef) {

    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0]; // Format YYYY-MM-DD

    this.showtable=true
    this.loading=true
   

    this.Addform = this.fb.group({
      im_code           : [''],  //
      bcn_code          : [''],
      im_name           : ['',Validators.required],
      // im_active         : [''],
      im_assetcode      : ['',Validators.required],
      // im_beaconid       : [''],
      im_categoryid     : ['',Validators.required],
      im_conditionid    : ['',Validators.required],
      im_statusid       : ['',Validators.required],
      // im_areaid         : [''],
      // im_siteid         : [''],

      // im_temperature    : [''],
      // im_companyid      : [''],
      br_name           : ['Robis',Validators.required],//
      // im_btry_prcnt     : [''],
      im_zonecurrentid  : ['',Validators.required],
      im_zonehomeid     : ['',Validators.required],
      br_itemdesc       : ['',Validators.required],
      br_lastservice    : ['',Validators.required],
      wr_expireson      : ['',Validators.required],
      // im_purchaseDate      : ['',Validators.required],//
      // im_purchaseFrom      : ['',Validators.required],//
      // im_warrantyPeriod    : ['',Validators.required],//
      // im_purchaseCost      : ['',Validators.required],//
      // im_replacementCost   : ['',Validators.required],//
      im_purchaseOrder     : [null],
      br_ponumber          : ['12345'],
      im_model             : ['RT'],
      // im_lastAuditDate     : ['',Validators.required],//
      // im_auditBy           : ['',Validators.required],//
      // im_nextaudit         : ['',Validators.required],//
      // im_assignto          : ['',Validators.required],////
      // im_sendmail          : ['',[Validators.email,Validators.email, this.customEmailValidator(), Validators.maxLength(255)]],///
      im_auditreport       : [null],
      im_createdon         : [''],//
      im_createdby         : [''],//
      im_modifiedon      : [''],//
      im_modifiedby        : [''],//
      // im_lastcapturedon   : [''],
      // im_firstupdate    : [''],
      im_lastupdated    : new FormControl(Validators.required),
      im_macadd            : ['',Validators.required],//
      im_liveimage : [null],
    });


  }
  activeTabIndex: number = 0;

  applyFilterGlobal($event:any, stringValue:any){
    this.dtt.filterGlobal(($event.target as HTMLInputElement).value, stringValue);

  }
  existingFilePath: string | null = null;
  ngOnInit() :void {
        // If `this.text` contains the server image URL, use it as the initial image
    // if (this.text) {
    //   this.selectedImage = this.text;
    //   console.log(this.selectedImage)
    // }
    this.Addform.reset();
    this.activeTabIndex = 0;
    this.GetData();
    // Simulate the response from the backend with a file path
    if (this.selectedData && this.selectedData.im_liveimage) {
      this.text = `${this.backendUrl}/${this.selectedData.im_liveimage}`;
      this.serverFileName = this.selectedData.im_liveimage.split('/').pop(); // Extract server file name
  } else if (this.selectedData && this.selectedData.im_auditreport){
    this.text1 = `${this.backendUrl}/${this.selectedData.im_auditreport}`;
    this.serverFileName = this.selectedData.im_auditreport.split('/').pop(); // Extract server file name
  }
    else if (this.selectedData && this.selectedData.im_purchaseOrder){
    this.text2 = `${this.backendUrl}/${this.selectedData.im_purchaseOrder}`;
    this.serverFileName = this.selectedData.im_purchaseOrder.split('/').pop(); // Extract server file name
  }
   else {
      this.serverFileName = null; // Reset if no file is provided by the server
      this.serverFileName1 = null;
      this.serverFileName2 = null;
  }

    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      }
    );
  }

  private _selectedItem: any[] = [];

set selectedItem(value: any[]) {
    this._selectedItem = value;
    this.sortSelectedItemsToTop();
}

get selectedItem() {
    return this._selectedItem;
}

sortSelectedItemsToTop() {
  this.tableData.item_data.sort((a: any, b: any) => {
      const isSelectedA = this.selectedItem.includes(a) ? 1 : 0;
      const isSelectedB = this.selectedItem.includes(b) ? 1 : 0;
      return isSelectedB - isSelectedA;  // This will move selected items to the top
  });
}


  GetData(){
    this.service.getData("item/data").subscribe(res =>{
      this.tableData = res
      this.loading=false
      this.showtable=false
      // console.log(this.tableData)

    });

  }

ReloadTable() {
    this.GetData(); // Call GetData to fetch and load the table data
}
    // Custom Email Validator
    customEmailValidator(): Validators {
      return (control: AbstractControl): ValidationErrors | null => {
        const emailPattern = /^[^\s@]+@motherson\.com$/;
        const valid = emailPattern.test(control.value);
        return valid ? null : { invalidEmail: true };
      };
    }
ngOnChanges(changes: SimpleChanges): void {
  if (changes['selectedItem'] && this.selectedItem) {
      this.Addform.patchValue(this.selectedItem);  // Apply the selected row data to the form
      this.ModalType = 'UPDATE';
  }
    else{
      this.Addform.reset();
      this.ModalType = 'ADD'
    }
  }

  @HostListener('change', ['$event.target.files']) emitFiles( event: FileList ) {
    const file = event && event.item(0);
    this.file = file;
  }

  onRowSelect(event: any) {
    this.selectedItem = event.data;  // Capture the selected row data
    // console.log(this.selectedItem);  // Verify the data in the console
    this.Addform.patchValue(this.selectedItem);  // Patch form with the selected row's data
    this.ModalType = 'UPDATE';  // Change the modal type to 'UPDATE'
}

  codeEndpoint = 'itemcode'

  selectedData: any = null
  itemcode : any
  beaconcode : any

  openNew(){
  //   this.itemDialog = true;
  // this.service.getdata(this.codeEndpoint).subscribe(
  //   res =>{
  //   let code = res.im_code
  //   this.Addform.get('im_code')?.setValue(code)
  // })

  this.itemDialog=true

  this.settingservice.getData("category/data").subscribe(res=>{
    this.categories=res

  })

  this.settingservice.getData("condition/data").subscribe(res=>{
    this.conditions=res

  })
  this.settingservice.getData("status/data").subscribe(res=>{
    this.status=res

  })
  this.settingservice.getData("businesslocations/zone").subscribe(res=>{
    this.locations=res

  })

  this.Addform.reset()
  this.selectedFileName = null
  this.selectedFileName1 = null
  this.selectedFileName2 = null
  this.serverFileName = null
  this.serverFileName1 = null
  this.serverFileName2 = null
    this.selectedData = null
    this.ModalType = 'ADD'
    this.service.getData(this.codeEndpoint).subscribe(
      res => {

        this.itemcode = res.im_code
        this.beaconcode = res.bcn_code

        // console.log(this.beaconcode)

          this.Addform.get('im_code')?.setValue(this.itemcode)
          this.Addform.get('bcn_code')?.setValue(this.beaconcode)

          let modifiedon=this.pipe.transform(this.date,'dd-MM-yyyy');

          this.Addform.controls['im_createdby'].setValue(this.Cookie.get('username'))
          this.Addform.controls['im_modifiedby'].setValue(this.Cookie.get('username'))
          this.Addform.controls['im_createdon'].setValue(modifiedon);
          this.Addform.controls['im_modifiedon'].setValue(modifiedon)

          this.Addform.controls['br_ponumber'].setValue('12345')
          this.Addform.controls['im_model'].setValue('RT');
          this.Addform.controls['br_name'].setValue('Robis')
          // this.Addform.controls['im_firstupdate'].setValue(modifiedon);
          this.Addform.controls['im_lastupdated'].setValue(modifiedon);
          // this.Addform.controls['im_lastcapturedon'].setValue(modifiedon);

      },
      error => {
        this.closeModal()
        this.messageService.add({ severity: 'error', summary: 'Code Not Generated', detail: 'Failed', life: 5000 });
        console.log("Error")
      }
    )

  }

  // getCat(): string {
  //   const selectedCatId = this.Addform.get('im_categoryid').value;
  //   const selectedCat = this.categories.find((cat:any) => cat.cm_id === selectedCatId);
  //   return selectedCat ? selectedCat.cm_name : '';
  // }
  editItems(i: any) {

    this.settingservice.getData("category/data").subscribe(res=>{
      this.categories=res
    })
    this.settingservice.getData("condition/data").subscribe(res=>{
      this.conditions=res
    })
    this.settingservice.getData("status/data").subscribe(res=>{
      this.status=res
    })
    this.settingservice.getData("businesslocations/zone").subscribe(res=>{
      this.locations=res
    })

    this.selectedData = i;
    this.itemDialog = true;
    // console.log("one", this.selectedData);
    this.ModalType = 'UPDATE';

    let modifiedon = this.pipe.transform(this.date, 'dd-MM-yyyy');

    // this.fileNameMap.im_auditreport = this.selectedData.im_auditreport.split('/').pop();

    // Patch the form with the selected data
    this.Addform.patchValue({
        im_id: this.selectedData.im_id,
        bcn_code: this.selectedData.bcn_code,
        im_code: this.selectedData.im_code,
        im_name: this.selectedData.im_name,
        im_assetcode: this.selectedData.im_assetcode,
        im_categoryid: this.selectedData.im_categoryid.cm_id,
        im_conditionid: this.selectedData.im_conditionid.cdn_id,
        im_statusid: this.selectedData.im_statusid.st_id,
        br_name: this.selectedData.br_name,
        im_zonecurrentid: this.selectedData.im_zonecurrentid.zn_id,
        im_zonehomeid: this.selectedData.im_zonehomeid.zn_id,
        br_itemdesc: this.selectedData.br_itemdesc,
        br_lastservice: this.selectedData.br_lastservice,
        wr_expireson: this.selectedData.wr_expireson,
        // im_purchaseDate: this.selectedData.im_purchaseDate,
        // im_purchaseFrom: this.selectedData.im_purchaseFrom,
        // im_warrantyPeriod: this.selectedData.im_warrantyPeriod,
        // im_purchaseCost: this.selectedData.im_purchaseCost,
        // im_replacementCost: this.selectedData.im_replacementCost,
        // im_lastAuditDate: this.selectedData.im_lastAuditDate,
        // im_auditBy: this.selectedData.im_auditBy,
        // im_nextaudit: this.selectedData.im_nextaudit,
        // im_assignto: this.selectedData.im_assignto,
        // im_sendmail: this.selectedData.im_sendmail,
        im_createdon: modifiedon,
        im_createdby: this.Cookie.get('username'),
        im_modifiedon: modifiedon,
        im_modifiedby: this.Cookie.get('username'),
        im_lastupdated: this.selectedData.im_lastupdated,
        im_macadd: this.selectedData.im_beaconid.bcn_code,
        br_ponumber: this.selectedData.br_ponumber,
        im_model: this.selectedData.im_model,
    });
// console.log(this.Addform.value,"patched value")
          // Set the text for the live image field (assuming it's the correct field)
          this.text = `${this.backendUrl}/${this.selectedData.im_liveimage}`;
          this.text1 = `${this.backendUrl}/${this.selectedData.im_auditreport}`;
          this.text2 = `${this.backendUrl}/${this.selectedData.im_purchaseOrder}`;
          this.dataChanged = true;

    // Update the server file name for display
    this.serverFileName = this.selectedData.im_liveimage.split('/').pop(); // Get the file name from server path
    this.serverFileName1 = this.selectedData.im_auditreport.split('/').pop();
    this.serverFileName2 = this.selectedData.im_purchaseOrder.split('/').pop();

    // Simulate a change event for the file input
    const event = {
        target: {
            files: [] // No new file selected initially
        }
    };

    // Call onFileChange to update UI as if a file was selected
    this.onFileChange(event, 'liveimage');
    this.onFileChange1(event, 'auditreport');
    this.onFileChange2(event, 'purchaseOrder')

    // console.log(this.serverFileName,"Dolu")
    // console.log(this.serverFileName1,"Bolu")
    // console.log(this.serverFileName2,"Bolu")
}


openFile(): void {
  const fileToOpen = this.selectedFileName || this.serverFileName;
  // const fileToOpen1 = this.selectedFileName1 || this.serverFileName1;
  // const fileToOpen2 = this.selectedFileName2 || this.serverFileName2;

  if (fileToOpen) {
      const filePath = this.text; // Construct the full URL if necessary
      window.open(filePath, '_blank');
  }
  else {
      console.warn('No file to open');
  }
}
openFile1(): void {
  // const fileToOpen = this.selectedFileName || this.serverFileName;
  const fileToOpen1 = this.selectedFileName1 || this.serverFileName1;
  // const fileToOpen2 = this.selectedFileName2 || this.serverFileName2;

  if(fileToOpen1){
    const filePath1 = this.text1; // Construct the full URL if necessary
    // console.log(filePath1,"Chutki")
    window.open(filePath1, '_blank');
  }
  else {
      console.warn('No file to open');
  }
}
openFile2(): void {
  // const fileToOpen = this.selectedFileName || this.serverFileName;
  // const fileToOpen1 = this.selectedFileName1 || this.serverFileName1;
  const fileToOpen2 = this.selectedFileName2 || this.serverFileName2;

  if(fileToOpen2){
    const filePath2 = this.text2; // Construct the full URL if necessary
    // console.log(filePath2,"Chutki")
    window.open(filePath2, '_blank');
  }
  else {
      console.warn('No file to open');
  }
}

sortNewOrUpdatedItemsToTop() {
  this.tableData.item_data.sort((a: { timestamp: any; }, b: { timestamp: any; }) => {
      // Sort by timestamp if available, then by selection if required
      return (b.timestamp || 0) - (a.timestamp || 0);
  });
}


   SavaData(Data:any){
    // this.tableData.push(Data)
    this.sortNewOrUpdatedItemsToTop();
    // this.tableData.unshift(Data)

  }

  // Update(Update:any){
  //   const i = this.tableData.findIndex((user:any) => user.im_code === this.selectedData.im_code);
  //   this.tableData[i] = Update;
  //   this.sortNewOrUpdatedItemsToTop();
  // }

  closeModal(){
    this.Addform.reset();
    this.file = null
    this.selectedFileName = null
    this.selectedFileName1 = null
    this.selectedFileName2 = null
    this.serverFileName = null
    this.serverFileName1 = null
    this.serverFileName2 = null
    this.selectedImage = '../../../assets/no-image.jpg';
    this.itemDialog=false
  }


  // onSubmit(){

  //   if(this.ModalType==='UPDATE'){
  //     this.OnUpdate();
  //   }
  //   else{
  //       const formData = new FormData();
  //     let imcode : any

  //       if (this.liveimageFile) {
  //         formData.append('im_liveimage', this.liveimageFile);
  //       }
  //       if (this.purchaseOrderFile) {
  //         formData.append('im_purchaseOrder', this.purchaseOrderFile);
  //       }
  //       if (this.auditreportFile) {
  //         formData.append('im_auditreport', this.auditreportFile);
  //       }
  //       if (this.itemcode) {
  //         this.service.getData(this.codeEndpoint).subscribe(
  //           res => {

  //             this.itemcode = res.im_code
  //             // this.imcode = this.itemcode
  //             formData.append('im_code',this.itemcode);
  //           // Submit the form after ensuring all data is ready
  //           this.submitFormData(formData);
  //         })

  //       } else {
  //         // If itemcode is already available, submit the form immediately
  //         this.submitFormData(formData);
  //       }
  //       // console.log(formData)


  //       this.http.post("http:////127.0.0.1:8000/item/upload/", formData).subscribe(
  //         response => console.log('Files submitted:', response),
  //         error => console.error('File submission failed:', error)
  //       );

  //       this.OnSave(this.Addform.value);
  //   }
  // }

  onSubmit() {
    if (this.ModalType === 'UPDATE') {
      this.OnUpdate();
    } else {
      const formData = new FormData();

      // Ensure itemcode is set before submitting the form
      if (this.itemcode) {
        this.service.getData(this.codeEndpoint).subscribe(
          res => {
            this.itemcode = res.im_code;

            // Append the item code to formData once available
            formData.append('im_code', this.itemcode);

            // Submit the form after ensuring all data is ready
            this.OnSave(this.Addform.value);  
          },
          error => {
            console.error('Failed to get item code:', error);
          }
        );
      } else {
        // If itemcode is already available, submit the form immediately
        this.OnSave(this.Addform.value);  
      }
    }
  }



  // LoadTable() {
  //   this.service.getData('item/data').subscribe(res => {
  //     // console.log('Fetched data:', res);
  //     if (Array.isArray(res.item_data)) {
  //       this.tableData = res.item_data;
  //       this.selectedFileName = null
  //       this.selectedFileName1 = null
  //       this.selectedFileName2 = null
  //     } else {
  //       console.error('Expected item_data to be an array but got:', res.item_data);
  //       this.tableData = []; // Set to empty array if data is not in expected format
  //     }
  //     this.cd.detectChanges(); // Trigger change detection if necessary
  //   });
  // }

  items:any[]=[]

  loadTable() {
    this.service.getData("item/data").subscribe(
      (data: any[]) => {
        // Convert items to a map for quick lookup
        const itemMap = new Map(this.items.map(item => [item.im_code, item]));
  
        // Update the table: Keep old items, update edited ones, and add new ones
        data.forEach(newItem => {
          itemMap.set(newItem.im_code, newItem); // Add or update items
        });
  
        // Convert back to an array and sort: recently updated items first
        this.items = Array.from(itemMap.values()).sort((a, b) => {
          const dateA = new Date(a.im_modifiedon || a.im_createdon).getTime();
          const dateB = new Date(b.im_modifiedon || b.im_createdon).getTime();
          console.log("funcion callled")
          return dateB - dateA; // 🔥 Newest first
        });
      },
      error => {
        console.log("Error loading table:", error);
      }
    );
  }
  
  updateTable(updatedItem: any) {
    // Find the index of the existing item (if edited)
    const index = this.items.findIndex(item => item.im_code === updatedItem.im_code);
  
    if (index !== -1) {
      // If the item exists, remove it from its old position
      this.items.splice(index, 1);
    }
  
    // Add the updated item to the beginning of the array (top of table)
    this.items.unshift(updatedItem);
  }
  

  OnSave(form:any){

    if (this.Addform) {
      this.service.postData(this.endpoint, form).subscribe(
        response =>{
          // this.SavaData(form)
          this.ReloadTable()
          this.updateTable(response); // 🔥 Handle edits and new additions dynamically
          this.Addform.reset();
          this.closeModal();
          this.messageService.add({ severity: 'success', summary: 'Added', detail:'Sucessfully', life: 4000 });
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Not Added', detail: 'Failed', life: 4000 });
          console.log("Error")
        }
      )
    }

  }

  selected: any = [];
  DisplayModal=false


OnUpdate() {
    if (this.selectedItem) {
        const formData = new FormData();
        // Append item code
        const itemCode = this.selectedData.im_code; // Use the selectedData directly
        if (itemCode) {
            formData.append('im_code', itemCode);
            // console.log("Item code being sent:", itemCode);
        } else {
            console.error("Item code not provided");
            return; // Exit if the item code is not present
        }

        // Call the helper function to submit the formData
        this.updateOtherData();
    }
}

submitFormDataUpdate(formData: FormData) {
    this.http.post(this.backendUrl, formData).subscribe(
        response => {
            // console.log('Files updated:', response);
            // After successful upload, call the function to update other data
            this.updateOtherData();
        },
        error => {
            console.error('File update failed:', error);
        }
    );
    this.Addform.patchValue(this.selectedItem);
}

updateOtherData() {
    // Call your service to update the additional data
    this.service.putData(this.endpoint, this.Addform.value).subscribe(
        update => {
            this.ReloadTable();
            this.closeModal();
            this.sortNewOrUpdatedItemsToTop();
            this.messageService.add({ severity: 'info', summary: 'Updated', detail: 'Successfully', life: 4000 });
        },
        error => {
            this.messageService.add({ severity: 'error', summary: 'Not Updated', detail: 'Failed', life: 4000 });
            console.log("Error");
        }
    );
}



  deleteRow() {
    if (this.selectedItem.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Selection',
        detail: 'Please select at least one row to delete.',
        life: 4000
      });
      return;
    }

    this.confirmation.confirm({
      message: 'Are you sure you want to delete the selected items?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      accept: () => {
        this.DeleteData();
      }
    });
  }


  DeleteData() {
    const totalItems = this.selectedItem.length;
    let deletedCount = 0;
    let errorCount = 0;

    if (totalItems === 0) return;

    

    for (let i = 0; i < this.selectedItem.length; i++) {
      const code = this.selectedItem[i].im_code;
      const name = this.selectedItem[i].im_name;
// console.log("select",code)
      this.service.deleteData(this.endpoint, code).subscribe(
        () => {
          deletedCount++;
          const index = this.tableData.findIndex((site: any) => site.im_code === code);
          if (index !== -1) {
            this.tableData.splice(index, 1);
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
    // Function to show a single toast message
    const showResultToast = () => {
      if (deletedCount > 0) {
        this.ReloadTable();
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: `Successfully deleted ${deletedCount} item(s).`, life: 4000 });
      }
      if (errorCount > 0) {
        this.messageService.add({ severity: 'error', summary: 'Failed', detail: `Failed to delete ${errorCount} item(s).`, life: 4000 });
      }
    };

    this.selectedItem = [];

  }


  fileChanged: { [key: string]: boolean } = {}; // Track file changes for multiple fields
  private trigger: any = new Subject();
  public webcamImage!: any;
  private nextWebcam: any = new Subject();
  captureImage  = '';
  fileName = '';
  public showWebcam = false;
  // url = '';
  imageData: any;

  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId!: string;
  public errors: WebcamInitError[] = [];
  DisplayCamModal = false
  public capturedImageData: string | null = null;

  captureImg(){
    this.DisplayCamModal = true
    this.showWebcam = true;
  }

  closeWebcamModal(){
    this.DisplayCamModal = false
    this.showWebcam = false
  }

  // Capture Image
  public takeSnapshot(): void {
    this.trigger.next();
  }

  // ON OFF Camera
  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  // Switch to next camera device if avaiable
  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public OkSnapshot(webcamImage: WebcamImage): void {
    this.DisplayCamModal = false
    this.imageData = webcamImage!.imageAsDataUrl
    this.selectedImage = this.imageData
    const byteString = atob(this.imageData.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: 'image/jpeg' });

    // Create a File object from the Blob
    this.file = new File([blob], 'captured_image.jpg', { type: 'image/jpeg' });
    this.webcamImage = undefined;
    this.showWebcam = false
  }

  showNextCamera() {
    if (this.showWebcam) {
      this.showNextWebcam(true);
    }
  }

  public retakeSnapshot(): void {
    this.webcamImage = undefined;
  }

  public takePicture(webcamImage: WebcamImage): void {
    // console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    // console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get initObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  deleteImg(){
    this.imageData = null
    this.selectedImage = '../../../assets/no-image.jpg';
    this.Addform.controls['im_liveimage'].reset()
  }



  selectedImage: string = '../../../assets/no-image.jpg';
  selectedImageName: string | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.readImageFile(file);
    } else {
      this.selectedImageName = null;
      this.selectedImage = '../../../assets/no-image.jpg';
    }
  }

  imagePreview: string | null = null;
  uploadedFile: File | null = null;
  // Function to handle file changes for multiple fields
  // onFileChange(event: any) {
  //   console.log('fn triggered');
  //   console.log(event,'<--event')
  //   // console.log(event.target.value,'target')
  //   // console.log(event.target.value.files[0],'files')
  //   // const file = event.target.files[0].name;
  //   // this.Addform.value.im_liveimage = file;
  //   // console.log(file);
  //   // console.log(this.Addform.value.im_liveimage);
  //   // console.log(`${this.backendUrl}${this.selectedData.im_purchaseOrder}`)
  //   // this.inputimage.nativeElement.value= `${this.backendUrl}${this.selectedData.im_purchaseOrder}`;
  //   // console.log(this.inputimage.nativeElement.value)
  //   // if (file) {
  //   //   this.readImageFile(file);
  //   //   this.Addform.get(fieldName)?.setValue(file);  // Update the form control
  //   //   this.fileNameMap[fieldName] = file.name; // Set the file name
  //   //   console.log(this.fileNameMap);
  //   // } else {
  //   //   this.selectedImageName = null;
  //   //   this.selectedImage = '../../../assets/no-image.svg';
  //   //   this.fileNameMap[fieldName] = null; // Reset if no file is selected
  //   // }
  // }
  // onFileChange(event: any, fileType: string): void {
  //   const input = event.target as HTMLInputElement;
  //   this.dataChanged=false
  //   if (input.files && input.files[0]) {
  //     if (fileType === 'liveimage') {
  //       this.liveimageFile = input.files[0];
  //     } else if (fileType === 'purchaseOrder') {
  //       this.purchaseOrderFile = input.files[0];
  //     } else if (fileType === 'auditreport') {
  //       this.auditreportFile = input.files[0];
  //     }
  //     this.text=event.target.files[0].name;
  //   }
  // }

    // Function to simulate file input change
    onFileChange(event: any, fileType: string): void {
      const input = event.target as HTMLInputElement;

      if (input.files && input.files[0]) {
        const file = input.files[0];

        // Handle file based on fileType
        if (fileType === 'liveimage') {
          this.liveimageFile = file;          // Store the live image file
          this.selectedFileName = file.name;  // Store the file name

          // Create a preview for the image using FileReader
          const reader = new FileReader();
          reader.onload = () => {
            // Update the image preview with the selected file or fallback to server URL or default image
            this.selectedImage = reader.result as string || this.text || '../../../assets/no-image.jpg';
            // console.log(this.selectedImage);
          };
          reader.readAsDataURL(file);  // Convert the file to Data URL for preview

        } else if (fileType === 'purchaseOrder') {
          this.purchaseOrderFile = file;

        } else if (fileType === 'auditreport') {
          this.auditreportFile = file;

        } else {
          this.selectedFileName = null;  // Reset file name if no file is selected
        }

        // Optional: Update text to hold the file name
        this.text = file.name;

      } else {
        // If no file is selected, revert to server image or default no-image
        this.selectedImage = this.text || '../../../assets/no-image.jpg';
      }
    }

  onFileChange1(event: any, fileType: string): void {
    const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    if (fileType === 'liveimage') {
      // this.liveimageFile = input.files[0];
      // this.selectedFileName = input.files[0].name;
    } else if (fileType === 'purchaseOrder') {
      // this.purchaseOrderFile = input.files[0];
    } else if (fileType === 'auditreport') {
      this.auditreportFile = input.files[0];
      this.selectedFileName1 = input.files[0].name;
    }else {
      this.selectedFileName1 = null; // Reset if no file is selected
  }
    this.text=event.target.files[0].name;
  }
}
onFileChange2(event: any, fileType: string): void {
  const input = event.target as HTMLInputElement;
if (input.files && input.files[0]) {
  if (fileType === 'liveimage') {
    // this.liveimageFile = input.files[0];
    // this.selectedFileName = input.files[0].name;
  } else if (fileType === 'purchaseOrder') {
    this.purchaseOrderFile = input.files[0];
    this.selectedFileName2 = input.files[0].name;
  } else if (fileType === 'auditreport') {
    // this.auditreportFile = input.files[0];

  }else {
    this.selectedFileName2 = null; // Reset if no file is selected
}
  this.text=event.target.files[0].name;
}
}

  fileUploadFn(event:any){
    this.dataChanged=false
    // this.Addform.patchValue().im_liveimage_text=`${this.backendUrl}${this.selectedData.im_purchaseOrder}`
    // console.log(this.Addform.patchValue().im_liveimage_text,'patch value')
    this.text=event.target.files[0].name
    // console.log(this.Addform.value.im_liveimage,"before-live img")
    // this.Addform.value.im_liveimage;
    // console.log(this.inputimageText,'element')
    // console.log(this.inputimageText.nativeElement.value,"input text")
    // console.log(this.Addform.value.im_liveimage_text,"live img text")
    // this.onFileChange();

  }


  readImageFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedImage = reader.result as string;
    };
    reader.readAsDataURL(file);
    // console.log( reader.readAsDataURL(file))
  }

  upload(event: any) {
    const file = event.target.files[0];
    const file1 = event.target.files[1];
    const file2 = event.target.files[2]
    if (!file && !file1 && !file2) return;  // If no file selected, return

    // Set the file property and start the upload
    this.file = file;
    this.file1 = file1;
    this.file2 = file2;

    this.uploadInProgress = true;

    // console.log("hai",this.file)

    let formParams = new FormData();
    formParams.append('file', file)

    // Call the uploadImage service method
    // this.service.uploadImage(file).subscribe(
    //   res => {
    //     // Handle successful upload
    //     this.messageService.add({ severity: 'success', summary: 'Image', detail: 'Uploaded Successfully', life: 4000 });
    //   },
    //   error => {
    //     // Handle upload error
    //     this.messageService.add({ severity: 'error', summary: 'Image', detail: 'Upload Failed', life: 4000 });
    //   },
    //   () => {
    //     // Reset upload status
    //     this.uploadInProgress = false;
    //   }
    // );
  }


//   exportXls(){

//    const table = document.getElementById('item');

//    // Check if the table element exists
//    if (!table) {
//      console.error("The table element with ID 'dom' does not exist.");
//      return;
//    }

//    const wb: XLSX.WorkBook = XLSX.utils.book_new();
//    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);

//    const headerRow = table.querySelector('thead tr');

//    const merge = [
//       { s: { r: 1, c: 1 }, e: { r: 2, c: 11 } },
//     ];

//     ws['!merges'] = merge;
//     XLSX.utils.sheet_add_aoa(ws, [['Item Management Details']], { origin: 'B2' });

//    // Leave 2 empty rows
//    XLSX.utils.sheet_add_aoa(ws, [['']], { origin: 'B3' });
//    XLSX.utils.sheet_add_aoa(ws, [['']], { origin: 'B4' });

//    // Add the table header (th) row data to the worksheet
//    if (headerRow) {
//      const headerData = [];
//      const headerCells = headerRow.getElementsByTagName('th');
//      for (let i = 1; i < headerCells.length - 1; i++) {
//        headerData.push(headerCells[i].textContent);
//      }
//      XLSX.utils.sheet_add_aoa(ws, [headerData], { origin: 'B5' });
//    }

//  // td data's
//   //  const tableData = [];
//   //  const rows = table.querySelectorAll('tbody tr');
//   //  for (let i = 0; i < rows.length; i++) {
//   //   const rowData = [];
//   //   const cells = rows[i].getElementsByTagName('td');
//   //   for (let j = 1; j < cells.length - 1; j++) {
//   //     // Skip the first and last cells in each row
//   //     rowData.push(cells[j].textContent);
//   //    }
//   //    tableData.push(rowData);
//   //  }

//   const tableData = this.tableData.item_data.map((item:any, index:any) => [
//     index + 1,
//     item.im_name,
//     item.im_assetcode,
//     item.im_beaconid.bcn_code,
//     item.im_categoryid.cm_name,
//     item.im_conditionid.cdn_name,
//     item.im_statusid.st_name,
//     item.im_zonecurrentid.zn_name,
//     item.im_temp,
//     item.im_btry_prcnt,
//     item.im_lastupdated,   
//   ]);

//    // Add your data to the worksheet below the header
//    XLSX.utils.sheet_add_aoa(ws, tableData, { origin: 'B6' });

//    ws['!cols'] = [
//     { wch: 10 },
//     { wch: 5 },
//     { wch: 30 },
//     { wch: 23 },
//     { wch: 20 },
//     { wch: 30 },
//     { wch: 16 },
//     { wch: 16 },
//     { wch: 25 },
//     { wch: 10 },
//     { wch: 12 },
//     { wch: 30 },
//   ];

//    for (var i in ws) {
//     if (typeof ws[i] != 'object') continue;
//       let cell = XLSX.utils.decode_cell(i);

//       ws[i].s = {
//             font: {
//               italic: true
//             },
//             alignment: {
//               vertical: 'center',
//               horizontal: 'center',
//             },
//             border: {
//               right: {style: 'thin'},
//               left: {style: 'thin'},
//               top : {style: 'thin'},
//               bottom: {style: 'thin'},
//             },
//           }
//           if (cell.r == 1) {
//             ws[i].s = {
//               font: {
//                 // italic: true,
//                 sz:'15',
//                 color:{ rgb: 'FF0000' },
//               },
//               alignment: {
//                 vertical: 'center',
//                 horizontal: 'center',
//               },

//             }
//           }

//       // heading row
//     if (cell.r == 4) {
//           ws[i].s = {
//             font: {
//               bold:true,
//               color:{ rgb: 'fffcfd' },
//             },
//             alignment: {
//               vertical: 'center',
//               horizontal: 'center',
//             },
//             border: {
//               right: {style: 'thin'},
//               left: {style: 'thin'},
//               top : {style: 'thin'},
//               bottom: {style: 'thin'},
//             },
//           }
//            ws[i].s.fill = {
//                 // background color
//                   patternType: 'solid',
//                   fgColor: { rgb: 'ff3030' },
//                   bgColor: { rgb: 'ff3030' },
//                 };
//         }
//         if (!ws[i].v) {
//           delete ws[i].s;
//         }

//  }

// // Remove border style for B4 cell
// const cellB4 = 'B4';
// const cellB4Style = {
//   border: {
//     top: { style: 'none' },
//     bottom: { style: 'none' },
//     left: { style: 'none' },
//     right: { style: 'none' },
//   },
// };
// ws[cellB4].s = cellB4Style;


//    XLSX.utils.book_append_sheet(wb, ws);
//    XLSX.writeFile(wb, 'Item_Data.xlsx');

//   }

exportXls() {
  const table = document.getElementById('item');


  // Check if the table element exists
  if (!table) {
    console.error("The table element with ID 'item' does not exist.");
    return;
  }

  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);

  const headerRow = table.querySelector('thead tr');

  const merge = [
    { s: { r: 1, c: 1 }, e: { r: 2, c: 11 } },
  ];

  ws['!merges'] = merge;
  XLSX.utils.sheet_add_aoa(ws, [['Item Management Details']], { origin: 'B2' });

  // Leave 2 empty rows
  XLSX.utils.sheet_add_aoa(ws, [['']], { origin: 'B3' });
  XLSX.utils.sheet_add_aoa(ws, [['']], { origin: 'B4' });

  // Add the table header (th) row data to the worksheet
  if (headerRow) {
    const headerData = [];
    const headerCells = headerRow.getElementsByTagName('th');
    for (let i = 1; i < headerCells.length - 1; i++) {
      headerData.push(headerCells[i].textContent);
    }
    XLSX.utils.sheet_add_aoa(ws, [headerData], { origin: 'B5' });
  }

  let filteredData = [];

  if (table && this.dtt.filteredValue) {
    filteredData = this.dtt.filteredValue.map((item: any, index: any) => [
      index + 1,
      item.im_name,
      item.im_assetcode,
      item.im_beaconid.bcn_code,
      item.im_categoryid.cm_name,
      item.im_conditionid.cdn_name,
      item.im_statusid.st_name,
      item.im_zonecurrentid.zn_name,
      item.im_temp,
      item.im_btry_prcnt,
      item.im_lastupdated,
    ]);
  } else {
    
    filteredData = this.tableData.item_data.map((item: any, index: any) => [
      index + 1,
      item.im_name,
      item.im_assetcode,
      item.im_beaconid.bcn_code,
      item.im_categoryid.cm_name,
      item.im_conditionid.cdn_name,
      item.im_statusid.st_name,
      item.im_zonecurrentid.zn_name,
      item.im_temp,
      item.im_btry_prcnt,
      item.im_lastupdated,
    ]);
  }

  
  XLSX.utils.sheet_add_aoa(ws, filteredData, { origin: 'B6' });

  // Column widths
  if (table || this.dtt.filteredValue) {
    ws['!cols'] = [
      { wch: 10 },
      { wch: 5 },
      { wch: 30 },
      { wch: 23 },
      { wch: 20 },
      { wch: 30 },
      { wch: 16 },
      { wch: 16 },
      { wch: 25 },
      { wch: 10 },
      { wch: 12 },
      { wch: 30 },
    ];
  }

  // Apply styles
  for (var i in ws) {
    if (typeof ws[i] !== 'object') continue;
    let cell = XLSX.utils.decode_cell(i);

    ws[i].s = {
      font: {
        italic: true
      },
      alignment: {
        vertical: 'center',
        horizontal: 'center',
      },
      border: {
        right: { style: 'thin' },
        left: { style: 'thin' },
        top: { style: 'thin' },
        bottom: { style: 'thin' },
      },
    };
    if (cell.r == 1) {
      ws[i].s = {
        font: {
          sz: '15',
          color: { rgb: 'FF0000' },
        },
        alignment: {
          vertical: 'center',
          horizontal: 'center',
        },
      };
    }

    // Heading row
    if (cell.r == 4) {
      ws[i].s = {
        font: {
          bold: true,
          color: { rgb: 'fffcfd' },
        },
        alignment: {
          vertical: 'center',
          horizontal: 'center',
        },
        border: {
          right: { style: 'thin' },
          left: { style: 'thin' },
          top: { style: 'thin' },
          bottom: { style: 'thin' },
        },
      };
      ws[i].s.fill = {
        patternType: 'solid',
        fgColor: { rgb: 'ff3030' },
        bgColor: { rgb: 'ff3030' },
      };
    }
    if (!ws[i].v) {
      delete ws[i].s;
    }
  }

  // Remove border style for B4 cell
  const cellB4 = 'B4';
  const cellB4Style = {
    border: {
      top: { style: 'none' },
      bottom: { style: 'none' },
      left: { style: 'none' },
      right: { style: 'none' },
    },
  };
  ws[cellB4].s = cellB4Style;

  // Append the sheet and export
  XLSX.utils.book_append_sheet(wb, ws);
  XLSX.writeFile(wb, 'Item_Data.xlsx');
}


}
