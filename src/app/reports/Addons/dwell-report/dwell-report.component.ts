import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ReportService } from '../../service/report.service';
import { Table } from 'primeng/table';
import { SettingsService } from '../../../settings/Add-ons/service/settings.service';
import { HttpClient } from '@angular/common/http';
import * as XLSX from "xlsx-js-style";

@Component({
  selector: 'app-dwell-report',
  templateUrl: './dwell-report.component.html',
  styleUrls: ['./dwell-report.component.scss']
})
export class DwellReportComponent {
  @Input() siteData: any;
  @Input() areaData: any;
  @Input() categoryData: any;
  @Input() zoneData: any;
  
  @ViewChild('dt') dt!: ElementRef;
  @ViewChild('dt', { static: false }) dtt!: Table;
form: any;

sitesname: any = [];
zonesname: any = [];
areasname: any = [];
categoriesname: any = [];
AssetDetails: any;

pipe = new DatePipe('en-US');
DwellTable: any;
dwellSearch: any;
dwellValue: any;

maxDate!: Date ;
minDate: Date | null = null; 
selectedCategoryName: string = '';

formgroup:boolean=false;
displaytable: boolean=false;
showloader: boolean=false;

getStartLoc(): string {
  if (!this.zonesname || !this.form.get('drstart_zoneid')?.value) {
    return ''; 
  }
  const selectedZoneId = this.form.get('drstart_zoneid').value;
  const selectedZone = this.zonesname.find((zone:any) => zone.zn_id === selectedZoneId);
  return selectedZone ? selectedZone.zn_name : '';
}

getEndLoc(): string {
  if (!this.zonesname || !this.form.get('drend_zoneid')?.value) {
    return ''; 
  }
  const selectedZoneId = this.form.get('drend_zoneid').value;
  const selectedZone = this.zonesname.find((zone:any) => zone.zn_id === selectedZoneId);
  return selectedZone ? selectedZone.zn_name : '';
}

getCat(): string {
  if (!this.categoriesname || !this.form.get('dr_category')?.value) {
    return ''; 
  }
  const selectedCatId = this.form.get('dr_category').value;
  const selectedCat = this.categoriesname.find((cat:any) => cat.cm_id === selectedCatId);
  return selectedCat ? selectedCat.cm_name : '';
}

getDwellValue(): string {
  if (!this.dwellValue || !this.form.get('dr_dwelloperator1')?.value) {
    return ''; 
  }
  const selectedValueCode = this.form.get('dr_dwelloperator1').value;
  const selectedValue = this.dwellValue.find((Dvalue:any) => Dvalue.code === selectedValueCode);
  return selectedValue ? selectedValue.name : '';
}


constructor(private fb: FormBuilder,private service: ReportService,private http: HttpClient)
{
  this.maxDate = new Date();
}

ngOnChanges(){
  this.sitesname = this.siteData
  this.areasname = this.areaData
  this.zonesname = this.zoneData
  this.categoriesname = this.categoryData 
  // this.AssetDetails = this.categoryData.cm_name
}
 ngOnInit(): void {
  this.dwellSearch = [
    {name: 'HOURS',   code: 'HOURS'},
  ];
  this.dwellValue =[
    {name: 'MORE THAN ONE',code: 'MORE THAN ONE'},
    {name: 'EQUALS',code: 'EQUALS'},
    {name: 'NOT EQUALS',code: 'NOT EQUALS'},
    {name: 'LESS THAN ',code: 'LESS THAN'},
    {name: 'LESS THAN OR EQUALS',code: 'LESS THAN OR EQUALS'},
    {name: 'MORE THAN ',code: 'MORE THAN'},
    {name: 'MORE THAN OR EQUALS',code: 'MORE THAN OR EQUALS'},
  ];
  // this.service.getData("businesslocations/site").subscribe(res => {
  //   this.sitesname = res.map((site: any) => ({ label: site.sc_name, value: site.sc_id }));
  // });

  // this.service.getData("businesslocations/area").subscribe(res => {
  //   this.areasname = res.map((area: any) => ({ label: area.ar_name, value: area.ar_id }));
  // });

  // this.service.getData("businesslocations/zone").subscribe(res => {
  //   this.zonesname = res;
  // });


  // this.service.getData("category/data").subscribe(res => {
  //   this.categoriesname = res;
  //   this.AssetDetails = res.cm_name
  // });




  this.form = this.fb.group({
    dr_frmdte:  new FormControl('', Validators.required),
    dr_todte: new FormControl('', Validators.required),
    dr_siteid: ['',Validators.required],
    dr_areaid: ['',Validators.required],
    // dr_zoneid: ['',Validators.required],
    dr_dwelltype: ['',Validators.required],
    dr_category:['',Validators.required],
    // dr_logicaloperator: ['',Validators.required],
    dr_dwelloperator1: ['',Validators.required],
    dr_dwelloperand1: [0,Validators.required],
    // dr_dwelloperator2: ['',Validators.required],
    // dr_dwelloperand2: [0]
    drstart_zoneid:['',Validators.required],
    drend_zoneid:['',Validators.required],
  });

  this.form.get('dr_category').valueChanges.subscribe((selectedCategoryId: any) => {
    const selectedCategory = this.categoriesname.find((category: any) => category.cm_id === selectedCategoryId);
    this.selectedCategoryName = selectedCategory ? selectedCategory.cm_name : '';
  });

  }

  

  OnSelectedChange(value:any){
    this.sitesname = Number(value.value)
  }
  // openfilter1(){
  //   this.showloader = false
  //   this.formgroup = !this.formgroup
  // }
  openfilter(){
    this.showloader = false
    this.displaytable = false
  }
  resetForm() {
    this.form.reset();
    this.displaytable = false
  }
  applyFilterGlobal($event:any, stringValue:any){
    this.dtt.filterGlobal(($event.target as HTMLInputElement).value, stringValue);
  }
  OnSubmit(){
  
  

  let fromDate=this.pipe.transform(this.form.value.dr_frmdte,"yyyy-MM-dd")
  let toDate=this.pipe.transform(this.form.value.dr_todte,"yyyy-MM-dd")

  this.form.controls['dr_frmdte'].setValue(fromDate);
  this.form.controls['dr_todte'].setValue(toDate);
  
  this.showloader = true;
  this.displaytable = false
 
  this.service.postData('virtualreport/dwelltime',this.form.value).subscribe(res => {
    this.showloader=false
    this.displaytable = true

     this.DwellTable = res.map((item: any) => ({
      ...item,
      entrytime: new Date(item.entrytime), 
      exittime: new Date(item.exittime) 
    }));
   
    this.form.patchValue({
      dr_frmdte: new Date(this.form.value.dr_frmdte), 
      dr_todte: new Date(this.form.value.dr_todte) 
    });
  });
 
}
formatDate(date: string): string {
  return new Date(date).toLocaleString('en-GB'); // Adjust formatting as needed
}

exportExcel(){
  const table = document.getElementById('dwell');

  if (!table) {
    console.error("The table element with ID 'dom' does not exist.");
    return;
  }

  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);

  const merge = [
     { s: { r: 1, c: 1 }, e: { r: 2, c: 7 } },
   ];
   ws['!merges'] = merge;
  // Generate the report title based on selectedCategoryName
  const reportTitle = this.selectedCategoryName
    ? `Dwell Report Details for ${this.selectedCategoryName}`
    : 'Dwell Report Details';

  // Add the title with the selected category name or fallback
  XLSX.utils.sheet_add_aoa(ws, [[reportTitle]], { origin: 'B2' });


   // Leave 2 empty rows
   XLSX.utils.sheet_add_aoa(ws, [['']], { origin: 'B3' });
   XLSX.utils.sheet_add_aoa(ws, [['']], { origin: 'B4' });

   const headerRow = table.querySelector('thead tr');

   if (headerRow) {
    const headerData = [];
    const headerCells = headerRow.getElementsByTagName('th');
    for (let i = 0; i < headerCells.length ; i++) {
      headerData.push(headerCells[i].textContent);
    }
    XLSX.utils.sheet_add_aoa(ws, [headerData], { origin: 'B5' });
  }

  // const tableData = [];
  // const rows = table.querySelectorAll('tbody tr');
  // for (let i = 0; i < rows.length; i++) {
  //  const rowData = [];
  //  const cells = rows[i].getElementsByTagName('td');
  //  for (let j = 0; j < cells.length ; j++) {
  //    // Skip the first and last cells in each row
  //    rowData.push(cells[j].textContent);
  //   }
  //   tableData.push(rowData);
  // }
  const tableData = this.DwellTable.map((item:any, index:any) => [
    index + 1, 
    item.name,
    item.from,
    this.formatDate(item.entrytime),
    item.to,
    this.formatDate(item.exittime),
    item.dwelltime
  ]);

  XLSX.utils.sheet_add_aoa(ws, tableData, { origin: 'B6' });

  ws['!cols'] = [
    { wch: 10 },
    { wch: 5 }, 
    { wch: 30 }, 
    { wch: 20 }, 
    { wch: 20 }, 
    { wch: 23 },  
    { wch: 23 },  
    { wch: 20 },  
    { wch: 20 },  
];

  for (var i in ws) {
    if (typeof ws[i] != 'object') continue;
      let cell = XLSX.utils.decode_cell(i);

      ws[i].s = {
            font: {
              italic: true,
            },
            alignment: {
              vertical: 'center',
              horizontal: 'center',
            },
            border: {
              right: {style: 'thin'},
              left: {style: 'thin'},
              top : {style: 'thin'},
              bottom: {style: 'thin'},
            },

          }
        
          if (cell.r == 1) {
            ws[i].s = {
              font: {
                // italic: true,
                sz:'15',
                color:{ rgb: 'FF0000' },
              },
              alignment: {
                vertical: 'center',
                horizontal: 'center',
              },
            }
          }
          // heading row
          if (cell.r == 4) {
            ws[i].s = {
              font: {
                bold:true,
                color:{ rgb: 'fffcfd' },
              },
              alignment: {
                vertical: 'center',
                horizontal: 'center',
              },
              border: {
                right: {style: 'thin'},
                left: {style: 'thin'},
                top : {style: 'thin'},
                bottom: {style: 'thin'},
              },
            }
            ws[i].s.fill = {
                  // background color
                    patternType: 'solid',
                    fgColor: { rgb: 'ff3030' },
                    bgColor: { rgb: 'ff3030' },
                  };
          }
          if (!ws[i].v) {
            delete ws[i].s;
          }

  }

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


  XLSX.utils.book_append_sheet(wb,ws);
  XLSX.writeFile(wb,'Dwell_Report.xlsx')
}
}
