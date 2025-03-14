import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ReportService } from '../../service/report.service';
import { Table } from 'primeng/table';
import { HttpClient } from '@angular/common/http';
import * as XLSX from "xlsx-js-style";
import { faExternalLinkSquare } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-mpl',
  templateUrl: './mpl.component.html',
  styleUrls: ['./mpl.component.scss']
})
export class MplComponent {

   @Input() categoryData: any;
   @Input() zoneData: any;
   
  @ViewChild('dt') dt!: ElementRef;
  @ViewChild('dt', { static: false }) dtt!: Table;
form: any;
data:any
mplTable: any;

minDate: Date | null = null; 
maxDate!: Date ;
pipe = new DatePipe('en-US');

// formgroup:boolean=false;
displaytable: boolean=false;
showloader: boolean=false;
visible:boolean = false;

sites: any[] = [];
areas: any[] = [];
zones: any[] = [];
category: any[] = [];
categoriesname: any = [];

mplStartLocation: any;
mplEndLocation: any;
mplFromDate: any;
mplToDate: any;

  selectedCategoryName: any;
mplcount: any;

getStartLoc(): string {
  if (!this.zones || !this.form.get('mpl_startlocation')?.value) {
    return '';
  }

  const selectedZoneId = this.form.get('mpl_startlocation').value;
  const selectedZone = this.zones.find((zone:any) => zone.zn_id === selectedZoneId);
  return selectedZone ? selectedZone.zn_name : '';
}

getEndLoc(): string {
  if (!this.zones || !this.form.get('mpl_endlocation')?.value) {
    return '';
  }
  const selectedZoneId = this.form.get('mpl_endlocation').value;
  const selectedZone = this.zones.find((zone:any) => zone.zn_id === selectedZoneId);
  return selectedZone ? selectedZone.zn_name : '';
}

getCat(): string {
  if (!this.category || !this.form.get('mpl_category')?.value) {
    return ''; 
  }
  const selectedCatId = this.form.get('mpl_category').value;
  const selectedCat = this.category.find((cat:any) => cat.cm_id === selectedCatId);
  return selectedCat ? selectedCat.cm_name : '';
}




constructor(private fb: FormBuilder,private service:ReportService,private http: HttpClient)
{
  this.maxDate = new Date();
  // this.minDate = new Date();
}

ngOnChanges(){
 
  this.zones = this.zoneData
  this.category = this.categoryData 


}

ngOnInit(): void {
  this.form = this.fb.group({
    mpl_frmdte:  new FormControl('', Validators.required),
    mpl_todte:  new FormControl('', Validators.required),
    mpl_startlocation: ['', Validators.required],
    mpl_endlocation: ['', Validators.required],
    mpl_category: ['', Validators.required],
    mpl_name:[""]
  });

  // this.service.getData("businesslocations/site").subscribe(res => {
  //   this.sites = res;
  // });

  // this.service.getData("businesslocations/area").subscribe(res => {
  //   this.areas = res;
  // });

  // this.service.getData("businesslocations/zone").subscribe(res => {
  //   this.zones = res;
  // });

  // this.service.getData("category/data").subscribe(res => {
  //   this.category = res;
  //   this.categoriesname = res
  // });
  this.form.get('mpl_category').valueChanges.subscribe((selectedCategoryId: any) => {
    const selectedCategory = this.category.find((category: any) => category.cm_id === selectedCategoryId);
    this.selectedCategoryName = selectedCategory ? selectedCategory.cm_name : '';
  });

}
selectedRowData:any;
selectedRow:any;

onRowSelect(event: any) {
  const rowData = event.data; // Extracting the selected row data
  this.selectedRow = rowData.mpl_name; // Assuming you're using this to bind the mpl_name
  // Any other logic related to row selection
}

showDialog(selectedRowData: any) {
  this.visible=true;
  // Prepare the data to post
  const postData = {
    mpl_startlocation: this.mplStartLocation,
    mpl_endlocation: this.mplEndLocation,
    mpl_frmdte: this.mplFromDate,
    mpl_todte: this.mplToDate,
    mpl_name: selectedRowData.name // Assuming 'name' is the correct field in selectedRowData
  };

  // Post the data to your API
  this.service.postData('virtualreport/mplcount', postData)
    .subscribe(res =>{
      this.mplcount = res.mplcount
     })
}

// openfilter1(){
//   this.showloader = false
//   this.formgroup = !this.formgroup
// }

mindate(){

}
openfilter(){
  this.showloader = false
  this.displaytable = false
  
}

applyFilterGlobal($event:any, stringValue:any){
  this.dtt.filterGlobal(($event.target as HTMLInputElement).value, stringValue);
}
resetForm() {
  this.form.reset();
  this.displaytable = false
}

OnSubmit(){
  this.showloader = true;
  this.displaytable = false

  let formdate=this.pipe.transform(this.form.value.mpl_frmdte,"yyyy-MM-dd")
  let todate=this.pipe.transform(this.form.value.mpl_todte,"yyyy-MM-dd")

  this.form.controls['mpl_frmdte'].setValue(formdate);
  this.form.controls['mpl_todte'].setValue(todate);

  this.mplStartLocation = this.form.value.mpl_startlocation;
  this.mplEndLocation = this.form.value.mpl_endlocation;
  this.mplFromDate = formdate;
  this.mplToDate = todate;
 
  this.service.postData('virtualreport/movementsperlocation',this.form.value).subscribe(res =>{
    this.displaytable = true
    this.showloader=false
    this.mplTable = res

    this.form.patchValue({
      mpl_frmdte: new Date(this.form.value.mpl_frmdte), 
      mpl_todte: new Date(this.form.value.mpl_todte) 
    });
    
   })
   
}

formatDate(date: string): string {
  return new Date(date).toLocaleString('en-GB'); // Adjust formatting as needed
}

exportExcel() {
  const table = document.getElementById('mpl');

  if (!table) {
    console.error("The table element with ID 'mpl' does not exist.");
    return;
  }

  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);

  const merge = [
    { s: { r: 1, c: 1 }, e: { r: 2, c: 5 } },
  ];
  ws['!merges'] = merge;

  const reportTitle = this.selectedCategoryName
    ? `Movements Per Location Details for ${this.selectedCategoryName}`
    : 'Movements Per Location Details';

  XLSX.utils.sheet_add_aoa(ws, [[reportTitle]], { origin: 'B2' });
  XLSX.utils.sheet_add_aoa(ws, [['']], { origin: 'B3' });
  XLSX.utils.sheet_add_aoa(ws, [['']], { origin: 'B4' });

  const headerRow = table.querySelector('thead tr');

  if (headerRow) {
    const headerData = [];
    const headerCells = headerRow.getElementsByTagName('th');
    // Loop until the second-to-last cell to skip the last one
    for (let i = 0; i < headerCells.length - 1; i++) {
      headerData.push(headerCells[i].textContent);
    }
    XLSX.utils.sheet_add_aoa(ws, [headerData], { origin: 'B5' });
  }

  // const tableData = [];
  // const rows = table.querySelectorAll('tbody tr');
  // for (let i = 0; i < rows.length; i++) {
  //   const rowData = [];
  //   const cells = rows[i].getElementsByTagName('td');
  //   // Loop until the second-to-last cell to skip the last one
  //   for (let j = 0; j < cells.length - 1; j++) {
  //     rowData.push(cells[j].textContent);
  //   }
  //   tableData.push(rowData);
  // }
  const tableData = this.mplTable.mpl.map((item:any, index:any) => [
    index + 1, 
    item.name,
    item.category,
    item.movements,
    this.formatDate(item.lastmovements)
  ]);

  XLSX.utils.sheet_add_aoa(ws, tableData, { origin: 'B6' });

  ws['!cols'] = [
    { wch: 10 },
    { wch: 5 },
    { wch: 30 },
    { wch: 20 },
    { wch: 18 },
    { wch: 23 },
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
  XLSX.writeFile(wb, 'MPL_Report.xlsx');
}

}
