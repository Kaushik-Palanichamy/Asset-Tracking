import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReportService } from '../../service/report.service';
import { ItemManagementService } from '../../../item-management/Add-ons/service/item-management.service';
import { DatePipe } from '@angular/common';
import { Table } from 'primeng/table';
import * as XLSX from "xlsx-js-style";

@Component({
  selector: 'app-path-tracking',
  templateUrl: './path-tracking.component.html',
  styleUrls: ['./path-tracking.component.scss']
})
export class PathTrackingComponent {
  @ViewChild('dt') dt!: ElementRef;
  @ViewChild('dt', { static: false }) dtt!: Table;
form: any;
pipe = new DatePipe('en-US');
timefrom: any;
timeto: any;
maxDate!: Date ;
url = 'assets/item-data.json';
itemsname: any = [];
filterdays: any;
AssetDetails: any

  selectedFilter=''
  selectedItem: any;
pathTrackingTable:any;

displaytable: boolean=false;
showloader: boolean=false;


isDragging = false;
  offset = { x: 0, y: 0 };
  form1: any;

  onDragStart(event: MouseEvent | TouchEvent): void {
    this.isDragging = true;
    const clientX = this.getClientX(event);
    const clientY = this.getClientY(event);

    const draggableElement = (event.target as HTMLElement).closest('.draggable') as HTMLElement;
    if (draggableElement) {
      const rect = draggableElement.getBoundingClientRect();
      this.offset = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    }

    document.addEventListener('mousemove', this.onDragMove.bind(this));
    document.addEventListener('touchmove', this.onDragMove.bind(this));
    document.addEventListener('mouseup', this.onDragEnd.bind(this));
    document.addEventListener('touchend', this.onDragEnd.bind(this));
  }

  onDragMove(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging) return;

    const clientX = this.getClientX(event);
    const clientY = this.getClientY(event);

    const draggableElement = document.querySelector('.draggable') as HTMLElement;
    if (draggableElement) {
      draggableElement.style.left = `${clientX - this.offset.x}px`;
      draggableElement.style.top = `${clientY - this.offset.y}px`;
    }
  }

  onDragEnd(): void {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.onDragMove.bind(this));
    document.removeEventListener('touchmove', this.onDragMove.bind(this));
    document.removeEventListener('mouseup', this.onDragEnd.bind(this));
    document.removeEventListener('touchend', this.onDragEnd.bind(this));
  }

  private getClientX(event: MouseEvent | TouchEvent): number {
    return event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  }

  private getClientY(event: MouseEvent | TouchEvent): number {
    return event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
  }

  getSelectedItemLabel(): string {
    const selectedItem = this.form.get('pt_item').value;
    const item = this.itemsname.find((i:any) => i.im_id === selectedItem);
    return item ? item.im_name : '';
  }

constructor(private fb: FormBuilder,private http: HttpClient,private service: ReportService,
  private itemservice: ItemManagementService)
{

  this.maxDate = new Date();
  this.service.getData('item/pathtracker').subscribe( res=>{
  this.itemsname = res


  let name = this.itemsname
  // console.log(typeof(name))
  // console.log("ITEM:",this.itemsname)

 });



 this.filterdays =[
  { name: 'Custom', code: 'Custom' },
   { name: '1 Day', code: '1 Day'  },
    { name: '7 Days', code: '7 Days' },
     { name: '15 Days', code: '15 Days' },
      { name: '30 Days', code: '30 Days' },
 ];

 this.form = this.fb.group({
  date1 : new FormControl('', Validators.required),
  date2: new FormControl('', Validators.required),
  pt_filter : ['',Validators.required],
  pt_item  : ['',Validators.required],
 })
}

ngOnInit(): void {
}
resetForm() {
  this.form.reset();
  this.displaytable = false
  this.selectedFilter = '';
}
  // Method to determine if the Apply Filter button should be disabled
  isButtonDisabled(): boolean {
    const itemControl = this.form.get('pt_item');
    const filterControl = this.selectedFilter;

    // Disable if the item is not selected
    if (!itemControl.value || itemControl.invalid) {
      return true;
    }

    // Disable if no filter is selected
    if (!filterControl) {
      return true;
    }

    if (filterControl === 'Custom') {
      // Check if either date1 or date2 is empty or invalid
      const date1Control = this.form.get('date1');
      const date2Control = this.form.get('date2');
      return !date1Control.value || !date2Control.value || date1Control.invalid || date2Control.invalid;
    }

    return false;
  }

OnSelectedChange(value:any){
  this.selectedItem = Number(value.value)
}

openfilter(){
  this.showloader = false
  this.displaytable = !this.displaytable
}

applyFilterGlobal($event:any, stringValue:any){
  this.dtt.filterGlobal(($event.target as HTMLInputElement).value, stringValue);
}

formatDate(date: string): string {
  return new Date(date).toLocaleString('en-GB'); // Adjust formatting as needed
}

dropdownChange(){
  // console.log(this.selectedFilter)

  const selectedFilterValue = this.selectedFilter;

  switch(selectedFilterValue){
    case '1 Day':
      this.filterDatafor1day();
    break;
    case '7 Days':
      this.filterDatafor7days();
    break;
    case '15 Days':
      this.filterDatafor15days();
    break;
    case '30 Days':
      this.filterDatafor30days();
    break;

  }
}
filterDatafor1day(){

  const currDate = new Date();
  const oneDayAgo =new Date();
  this.timefrom=""
  this.timeto=""
  oneDayAgo.setDate(currDate.getDate()-1)
  this.timefrom=this.pipe.transform(oneDayAgo,'yyyy-MM-dd')
  this.timeto=this.pipe.transform(currDate,'yyyy-MM-dd')

  // console.log(oneDayAgo)
}
filterDatafor7days(){
  this.timefrom=""
  this.timeto=""
  var sevendays = new Date((new Date()).valueOf() - 7000*60*60*24);
  var yesterday = new Date((new Date()).valueOf() - 1000*60*60*24);
  this.timefrom=this.pipe.transform(sevendays,'yyyy-MM-dd')
  this.timeto=this.pipe.transform(yesterday,'yyyy-MM-dd')
}
filterDatafor15days(){
  this.timefrom=""
  this.timeto=""
  var fifteendays = new Date((new Date()).valueOf() - 15000*60*60*24);
  var yesterday = new Date((new Date()).valueOf() - 1000*60*60*24);
  this.timefrom=this.pipe.transform(fifteendays,'yyyy-MM-dd')
  this.timeto=this.pipe.transform(yesterday,'yyyy-MM-dd')
}
filterDatafor30days(){
  this.timefrom=""
  this.timeto=""
  var thirtydays = new Date((new Date()).valueOf() - 30000*60*60*24);
  var yesterday = new Date((new Date()).valueOf() - 1000*60*60*24);
  this.timefrom=this.pipe.transform(thirtydays,'yyyy-MM-dd')
  this.timeto=this.pipe.transform(yesterday,'yyyy-MM-dd')
}
OnSubmit(){


  const selectedFilterValue = this.selectedFilter;

  switch(selectedFilterValue){
    case 'Custom':
        let date1=this.form.value.date1
        let date2=this.form.value.date2

      let datass = {
        "pt_filter":this.selectedFilter,
        "pt_item":this.selectedItem,
        "pt_fromdate":this.pipe.transform(date1,'yyyy-MM-dd'),
        "pt_todate":this.pipe.transform(date2,'yyyy-MM-dd')
      }
      this.displaytable = false
      this.showloader = true;
      this.service.postData('taglocation/pathtracking',datass).subscribe(res =>{
        this.showloader = false;
        this.displaytable = true
        this.pathTrackingTable = res
        this.AssetDetails = res.Asset_data
       })
      //  console.log(datass)
    break;
    case '1 Day':
      let datas = {
        "pt_filter":this.selectedFilter,
        "pt_item":this.selectedItem,
        "pt_fromdate":this.timefrom,
        "pt_todate":this.timeto
      }
      // console.log(this.selectedItem)
      this.showloader = true;
      this.displaytable = false
      this.service.postData('taglocation/pathtracking',datas).subscribe(res =>{
        this.showloader = false;
        this.displaytable = true
        this.pathTrackingTable = res
        this.AssetDetails = res.Asset_data
       })

    break;
    case '7 Days':
      let datas1 = {
        "pt_filter":this.selectedFilter,
        "pt_item":this.selectedItem,
        "pt_fromdate":this.timefrom,
        "pt_todate":this.timeto
      }
      this.showloader = true;
      this.displaytable = false
      this.service.postData('taglocation/pathtracking',datas1).subscribe(res =>{
        this.showloader = false;
        this.displaytable = true
        this.pathTrackingTable = res
        this.AssetDetails = res.Asset_data
       })
      // console.log(datas1)
    break;
    case '15 Days':
      let datas2 = {
        "pt_filter":this.selectedFilter,
        "pt_item":this.selectedItem,
        "pt_fromdate":this.timefrom,
        "pt_todate":this.timeto
      }
      this.showloader = true;
      this.displaytable = false
      this.service.postData('taglocation/pathtracking',datas2).subscribe(res =>{
        this.showloader = false;
        this.displaytable = true
        this.pathTrackingTable = res
        this.AssetDetails = res.Asset_data
       })
      // console.log(datas2)
    break;
    case '30 Days':
      let datas3 = {
        "pt_filter":this.selectedFilter,
        "pt_item":this.selectedItem,
        "pt_fromdate":this.timefrom,
        "pt_todate":this.timeto
      }
      this.showloader = true;
      this.displaytable = false
      this.service.postData('taglocation/pathtracking',datas3).subscribe(res =>{
        this.showloader = false;
        this.displaytable = true
        this.pathTrackingTable = res
        this.AssetDetails = res.Asset_data
       })
      // console.log(datas3)
    break;
  }
 
}

exportExcel() {
  const table = document.getElementById('dom');

  if (!table) {
    console.error("The table element with ID 'dom' does not exist.");
    return;
  }

  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
  const merge = [
    { s: { r: 1, c: 1 }, e: { r: 2, c: 5 } },
  ];
  ws['!merges'] = merge;

  const reportTitle = this.AssetDetails && this.AssetDetails.item_name
      ? `Path Tracking Report for ${this.AssetDetails.item_name}`
      : 'Path Tracking Report';

  XLSX.utils.sheet_add_aoa(ws, [[reportTitle]], { origin: 'B2' });
  XLSX.utils.sheet_add_aoa(ws, [['']], { origin: 'B3' });
  XLSX.utils.sheet_add_aoa(ws, [['']], { origin: 'B4' });

  const headerRow = table.querySelector('thead tr');

  if (headerRow) {
    const headerData = [];
    const headerCells = headerRow.getElementsByTagName('th');
    for (let i = 0; i < headerCells.length; i++) {
      headerData.push(headerCells[i].textContent);
    }
    XLSX.utils.sheet_add_aoa(ws, [headerData], { origin: 'B5' });
  }

  // const tableData = [];
  // const rows = table.querySelectorAll('tbody tr');
  // for (let i = 0; i < rows.length; i++) {
  //   const rowData = [];
  //   const cells = rows[i].getElementsByTagName('td');
  //   for (let j = 0; j < cells.length; j++) {
  //     rowData.push(cells[j].textContent);
  //   }
  //   tableData.push(rowData);
  // }
  const tableData = this.pathTrackingTable.table_data.map((item:any, index:any) => [
    index + 1, 
    item.from,
    item.entrytime,
    item.to,
    item.exittime
  ]);
  XLSX.utils.sheet_add_aoa(ws, tableData, { origin: 'B6' });

  ws['!cols'] = [
    { wch: 10 }, 
    { wch: 5 },
    { wch: 25 },
    { wch: 20 },
    { wch: 25 },
    { wch: 20 },
  ];

  // Set default styles (white background) for all cells
  for (let cell in ws) {
    if (typeof ws[cell] != 'object') continue;
    ws[cell].s = {
      fill: {
        patternType: 'solid',
        fgColor: { rgb: 'FFFFFF' }, // White background
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
  }

  // Apply specific styles for non-empty cells
  for (var i in ws) {
    if (typeof ws[i] != 'object') continue;
    let cell = XLSX.utils.decode_cell(i);
    
    // Title cell style
    if (cell.r == 1) {
      ws[i].s = {
        font: {
          sz: '14',
          color: { rgb: 'FF0000' },
        },
        alignment: {
          vertical: 'center',
          horizontal: 'center',
        },
      };
    }

    // Heading row style
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
        fill: {
          patternType: 'solid',
          fgColor: { rgb: 'ff3030' },
        },
      };
    }

    // Remove styles for empty cells to show white background
    if (!ws[i].v) {
      delete ws[i].s;
    }
  }

  // Set specific style for B4
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

  XLSX.utils.book_append_sheet(wb, ws);
  XLSX.writeFile(wb, 'Path-Tracking_Report.xlsx');
}





}
