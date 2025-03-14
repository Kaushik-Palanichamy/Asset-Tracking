import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ReportService } from '../../service/report.service';
import { Table } from 'primeng/table';
import { HttpClient } from '@angular/common/http';
import * as XLSX from "xlsx-js-style";

@Component({
  selector: 'app-asset-availability',
  templateUrl: './asset-availability.component.html',
  styleUrls: ['./asset-availability.component.scss']
})
export class AssetAvailabilityComponent {
  @Input() siteData: any;
  @Input() areaData: any;
  @Input() categoryData: any;
  @Input() zoneData: any;

  @ViewChild('dt') dt!: ElementRef;
  @ViewChild('dt', { static: false }) dtt!: Table;

form: any;

assetavailabilityTable: any;

maxDate!: Date ;
pipe = new DatePipe('en-US');

sitesname: any = [];
zonesname: any = [];
areasname: any = [];
categoriesname: any = [];

formgroup:boolean=false;
displaytable: boolean=false;
showloader: boolean=false;
  selectedCategoryName: any;

getZone(): string {
  if (!this.zonesname || !this.form.get('aa_zoneid')?.value) {
    return ''; 
  }

  const selectedZoneId = this.form.get('aa_zoneid').value;
  const selectedZone = this.zonesname.find((zone:any) => zone.zn_id === selectedZoneId);
  return selectedZone ? selectedZone.zn_name : '';
}

getCat(): string {
  if (!this.categoriesname || !this.form.get('aa_category')?.value) {
    return ''; 
  }

  const selectedCatId = this.form.get('aa_category').value;
  const selectedCat = this.categoriesname.find((cat:any) => cat.cm_id === selectedCatId);
  return selectedCat ? selectedCat.cm_name : '';
}

constructor(private fb: FormBuilder,private service:ReportService,private http: HttpClient){
  this.maxDate = new Date();
}
ngOnChanges(){
  this.sitesname = this.siteData
  this.areasname = this.areaData
  this.zonesname = this.zoneData
  this.categoriesname = this.categoryData 
}

ngOnInit(): void {
  this.form = this.fb.group({
    aa_frmdte:   ['',Validators.required],
    aa_todte:   ['',Validators.required],
    aa_siteid: ['',Validators.required],
    aa_areaid: ['',Validators.required],
    aa_zoneid: ['',Validators.required],
    aa_category:['',Validators.required],
  });
  // this.service.getData("businesslocations/site").subscribe(res => {
  //   this.sitesname = res.map((site: any) => ({ label: site.sc_name, value: site.sc_id }));
  // });

  // this.service.getData("businesslocations/area").subscribe(res => {
  //   this.areasname = res.map((area: any) => ({ label: area.ar_name, value: area.ar_id }));
  // });

  // this.service.getData("businesslocations/zone").subscribe(res => {
  //   this.zonesname = res
  // });

  // this.service.getData("category/data").subscribe(res => {
  //   this.categoriesname = res
  // });
  this.form.get('aa_category').valueChanges.subscribe((selectedCategoryId: any) => {
    const selectedCategory = this.categoriesname.find((category: any) => category.cm_id === selectedCategoryId);
    this.selectedCategoryName = selectedCategory ? selectedCategory.cm_name : '';
  });
}
applyFilterGlobal($event:any, stringValue:any){
  this.dtt.filterGlobal(($event.target as HTMLInputElement).value, stringValue);
}
openfilter1(){
  this.showloader = false
  this.formgroup = !this.formgroup
}
resetForm() {
  this.form.reset();
  this.displaytable = false
}

openfilter(){
  this.showloader = false
  this.displaytable = false
}

OnSubmit(){
  this.showloader = true;
  this.displaytable = false

  let formdate=this.pipe.transform(this.form.value.aa_frmdte,"yyyy-MM-dd")
  let todate=this.pipe.transform(this.form.value.aa_todte,"yyyy-MM-dd")

  this.form.controls['aa_frmdte'].setValue(formdate);
  this.form.controls['aa_todte'].setValue(todate);

  this.service.postData('virtualreport/assetavailability',this.form.value).subscribe(res =>{
    this.showloader=false
    this.displaytable = true
    this.assetavailabilityTable = res

    this.form.patchValue({
      aa_frmdte: new Date(this.form.value.aa_frmdte), 
      aa_todte: new Date(this.form.value.aa_todte) 
    });
   })
 
}

formatDate(date: string): string {
  return new Date(date).toLocaleString('en-GB'); // Adjust formatting as needed
}

exportExcel(){
  const table = document.getElementById('avail');

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
    
       const reportTitle = this.selectedCategoryName
       ? `Asset Availability Report Details for   ${this.selectedCategoryName}`
       : 'Asset Availability Report Details';

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
  const tableData = this.assetavailabilityTable.map((item:any, index:any) => [
    index + 1, 
    item.item_name,
    item.tg_stlocation,
    item.tg_starttime,
    item.tg_endlocation,
    item.tg_endtime,
    item.tg_dwelltime
  ]);
  XLSX.utils.sheet_add_aoa(ws, tableData, { origin: 'B6' });
       
        ws['!cols'] = [
          { wch: 10 }, 
          { wch: 5 }, 
          { wch: 30 }, 
          { wch: 25 }, 
          { wch: 25 }, 
          { wch: 20 }, 
          { wch: 20 },  
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
  XLSX.writeFile(wb, 'Asset_Availability.xlsx')

}
}
