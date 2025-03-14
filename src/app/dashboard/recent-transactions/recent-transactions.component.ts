
import { Component, Input, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { DashboardService } from '../service/dashboard.service';
import { DatePipe } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MatCardModule } from '@angular/material/card';
import { CalendarModule } from 'primeng/calendar';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as XLSX from "xlsx-js-style";

@Component({
  selector: 'app-recent-transactions',
  templateUrl: '../recent-transactions/recent-transactions.component.html',
  styleUrls: ['../recent-transactions/recent-transactions.component.scss']
})
export class RecentTransactionsComponent {
  @Input() tdytransaction: any

  @ViewChild('dt', { static: true })
  dt!: Table;

  form: any;
  Table: any = { Recent_Transaction: [] }

  date=new Date()
  pipe= new DatePipe("en-US")
  loading: boolean = false;

  applyFilterGlobal($event:any, stringValue:any){
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringValue);
  }

  minDate: Date;
  maxDate: Date;

  constructor(private service:DashboardService,private fb: FormBuilder,)
  {
    this.minDate = new Date(2018, 0, 1);
    this.maxDate = new Date();

    this.form = this.fb.group({
      date: [''],
    });

  }
 
  ngOnInit() {
    // this.loadData(new Date()); 
    this.loading = true;
    this.Table = this.tdytransaction
    this.loading = false;
  }


  loadData(date: Date) {
    // const formattedDate = { date: this.pipe.transform(date, 'yyyy-MM-dd') };
    // this.loading = true;

    // this.service.postData('overview/dashboard', formattedDate).subscribe(
    //   (res) => {
    //     this.Table = res;
    //     this.loading = false;
    //   },
    //   (error) => {
    //     console.error('Error loading data:', error);
    //     this.loading = false;
    //   }
    // );
  }

  OnSubmit(event: any) {
    const formattedDate = { date: this.pipe.transform(event, 'yyyy-MM-dd') };
    this.loading = true;

    this.service.postData('overview/dashboard', formattedDate).subscribe(
      (res) => {
        this.Table = res; 
        this.loading = false;
      },
      (error) => {
        console.error('Error submitting data:', error);
        this.loading = false;
      }
    );
  }

  exportExcel(){
    const table = document.getElementById('recent');

    if (!table) {
      console.error("The table element with ID 'recent' does not exist.");
      return;
    }

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);

    const merge = [
       { s: { r: 1, c: 1 }, e: { r: 2, c: 6 } },
     ];
     ws['!merges'] = merge;
     XLSX.utils.sheet_add_aoa(ws, [['Recent Transaction Details']], { origin: 'B2' });


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
    
    let filteredData = [];

  if (table && this.dt.filteredValue) {
    filteredData = this.dt.filteredValue.map((item: any, index: any) => [
      index + 1,
      item.ItemName,
      item.Category,
      item.Status,
      item.Location,
      item.LastSeen,
    ]);
  } else {
    
    filteredData = this.Table.Recent_Transaction.map((item: any, index: any) => [
      index + 1,
      item.ItemName,
      item.Category,
      item.Status,
      item.Location,
      item.LastSeen,
    ]);
  }

    // const tableData = this.Table.Recent_Transaction.map((item:any, index:any) => [
    //   index + 1,
    //   item.ItemName,
    //   item.Category,
    //   item.Status,
    //   item.Location,
    //   item.LastSeen,
    // ]);


    XLSX.utils.sheet_add_aoa(ws, filteredData, { origin: 'B6' });

    if (table || this.dt.filteredValue) {
    ws['!cols'] = [
      { wch: 10 },
      { wch: 5 }, 
      { wch: 30 }, 
      { wch: 25 },
      { wch: 25 }, 
      { wch: 25 }, 
      { wch: 30 },  
    ];
  }
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
    XLSX.writeFile(wb,'Recent_Transactions.xlsx')
  }
}
