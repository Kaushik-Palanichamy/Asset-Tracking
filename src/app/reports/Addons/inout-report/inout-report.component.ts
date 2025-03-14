import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ReportService } from '../../service/report.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { HttpClient } from '@angular/common/http';
import * as XLSX from "xlsx-js-style";

@Component({
  selector: 'app-inout-report',
  templateUrl: './inout-report.component.html',
  styleUrls: ['./inout-report.component.scss']
})
export class InoutReportComponent {

  @Input() siteData: any;
  @Input() areaData: any;
  @Input() categoryData: any;
  @Input() zoneData: any;

  @ViewChild('dt') dt!: ElementRef;
  @ViewChild('dt', { static: false }) dtt!: Table;
  form: any;
  maxDate!: Date ;
  pipe = new DatePipe('en-US');
  inoutTable: any;

  sitesname: any = [];
  zonesname: any = [];
  areasname: any = [];
  categoriesname: any = [];

  formgroup: boolean = false;
  displaytable: boolean = false;
  showloader: boolean = false;
  selectedCategoryName: any;

  getStartLoc(): string {
    if (!this.zonesname || !this.form.get('start_zoneid')?.value) {
      return ''; 
    }
    const selectedZoneId = this.form.get('start_zoneid').value;
    const selectedZone = this.zonesname.find((zone:any) => zone.zn_id === selectedZoneId);
    return selectedZone ? selectedZone.zn_name : '';
  }
  
  getEndLoc(): string {
    if (!this.zonesname || !this.form.get('end_zoneid')?.value) {
      return ''; 
    }

    const selectedZoneId = this.form.get('end_zoneid').value;
    const selectedZone = this.zonesname.find((zone:any) => zone.zn_id === selectedZoneId);
    return selectedZone ? selectedZone.zn_name : '';
  }

  getCat(): string {
    if (!this.categoriesname || !this.form.get('io_category')?.value) {
      return ''; 
    }

    const selectedCatId = this.form.get('io_category').value;
    const selectedCat = this.categoriesname.find((cat:any) => cat.cm_id === selectedCatId);
    return selectedCat ? selectedCat.cm_name : '';
  }

  constructor(private service: ReportService, private fb: FormBuilder, private http: HttpClient) 
  {   this.maxDate = new Date(); }

  ngOnChanges(){
    this.sitesname = this.siteData
    this.areasname = this.areaData
    this.zonesname = this.zoneData
    this.categoriesname = this.categoryData 
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      io_frmdte:  ['', Validators.required],
      io_todte:  ['', Validators.required],
      io_siteid:['', Validators.required],
      io_areaid:['', Validators.required],
      start_zoneid:['', Validators.required],
      end_zoneid:['', Validators.required],
      io_category:['', Validators.required],
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
    this.form.get('io_category').valueChanges.subscribe((selectedCategoryId: any) => {
      const selectedCategory = this.categoriesname.find((category: any) => category.cm_id === selectedCategoryId);
      this.selectedCategoryName = selectedCategory ? selectedCategory.cm_name : '';
    });
  }

  openfilter1() {
    this.showloader = false;
    this.formgroup = !this.formgroup;
  }

  openfilter() {
    this.showloader = false;
    this.displaytable = false;
  }

  applyFilterGlobal($event: any, stringValue: any) {
    this.dtt.filterGlobal(($event.target as HTMLInputElement).value, stringValue);
  }
  resetForm() {
    this.form.reset();
    this.displaytable = false
  }
  OnSubmit() {
    this.showloader = true;
    this.displaytable = false

    let formdate = this.pipe.transform(this.form.value.io_frmdte, "yyyy-MM-dd");
    let todate = this.pipe.transform(this.form.value.io_todte, "yyyy-MM-dd");

    this.form.controls['io_frmdte'].setValue(formdate);
    this.form.controls['io_todte'].setValue(todate);

    this.service.postData('virtualreport/inout', this.form.value).subscribe(res => {
      this.inoutTable = res;
  
      this.form.patchValue({
        io_frmdte: new Date(this.form.value.io_frmdte), 
        io_todte: new Date(this.form.value.io_todte) 
      });
  
    }, (error) => {
      console.error('Error:', error);
    }, () => {
      this.showloader = false;
      this.displaytable = true
    });

   
 
}
formatDate(date: string): string {
  return new Date(date).toLocaleString('en-GB'); // Adjust formatting as needed
}
  //Exporting Excel Format
  exportExcel() {
    const table = document.getElementById('inout');

    if (!table) {
      console.error("The table element with ID 'dom' does not exist.");
      return;
    }

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);

    const merge = [
      { s: { r: 1, c: 1 }, e: { r: 2, c: 6 } },
    ];
    ws['!merges'] = merge;
      // Generate the report title based on selectedCategoryName
  const reportTitle = this.selectedCategoryName
  ? `In & OUT Report Details for ${this.selectedCategoryName}`
  : 'In & OUT Report Details';

// Add the title with the selected category name or fallback
XLSX.utils.sheet_add_aoa(ws, [[reportTitle]], { origin: 'B2' });

    // Leave 2 empty rows
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
    const tableData = this.inoutTable.inoutdata.map((item:any, index:any) => [
      index + 1,
      item.name,
      item.entrytime,
      this.formatDate(item.from),
      item.exittime,
      this.formatDate(item.to)
    ]);

    XLSX.utils.sheet_add_aoa(ws, tableData, { origin: 'B6' });
      
  ws['!cols'] = [
    { wch: 10 }, 
    { wch: 5 }, 
    { wch: 30 },
    { wch: 20 },
    { wch: 20 },
    { wch: 23 }, 
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
          right: { style: 'thin' },
          left: { style: 'thin' },
          top: { style: 'thin' },
          bottom: { style: 'thin' },
        },
      }
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
        }
      }
      // heading row
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
        }
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
    XLSX.writeFile(wb, 'In-Out_Report.xlsx');
  }
}
