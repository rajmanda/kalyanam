import { Component, Inject, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-all-rsvps-dialog',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatDialogModule],
  templateUrl: './all-rsvps-dialog.component.html',
  styleUrls: ['./all-rsvps-dialog.component.css']
})
export class AllRsvpsDialogComponent implements AfterViewInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(
    public dialogRef: MatDialogRef<AllRsvpsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any[],
    private cdr: ChangeDetectorRef
  ) {
    console.log('AllRsvpsDialogComponent received data:', data);
    const flatData = data.map(item => {
      if (item && typeof item === 'object' && item.rsvpDetails && typeof item.rsvpDetails === 'object') {
        const { rsvpDetails, ...rest } = item;
        return { ...rest, ...rsvpDetails };
      }
      return item;
    });
    // Remove 'description', 'location', 'image', 'rsvpid', 'rsvpId', and 'id' fields from each row
    const cleanedData = flatData.map(row => {
      const { description, location, image, rsvpid, rsvpId, id, ...rest } = row;
      return rest;
    });
    this.dataSource = new MatTableDataSource(cleanedData);
    this.displayedColumns = cleanedData && cleanedData.length > 0 ? Object.keys(cleanedData[0]) : [];
  }

  displayHeader(column: string): string {
    // Convert camelCase or snake_case to Normal Case
    if (!column) return '';
    // Replace underscores with spaces, then insert space before capital letters
    let label = column.replace(/_/g, ' ');
    label = label.replace(/([a-z])([A-Z])/g, '$1 $2');
    // Capitalize first letter of each word
    label = label.replace(/\b\w/g, c => c.toUpperCase());
    return label;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  downloadCsv(): void {
    const rows = this.dataSource.filteredData;
    if (!rows || rows.length === 0) {
      alert('No data to download.');
      return;
    }
    const replacer = (key: string, value: any) => value === null || value === undefined ? '' : value;
    const header = this.displayedColumns;
    const csv = [
      header.join(','),
      ...rows.map(row => header.map(field => {
        let cell = row[field];
        if (typeof cell === 'string') {
          cell = cell.replace(/"/g, '""'); // Escape quotes
          if (cell.search(/([",\n])/g) >= 0) {
            cell = '"' + cell + '"';
          }
        }
        return cell;
      }).join(','))
    ].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rsvps.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  ngAfterViewInit() {
    // Assign sort after view and dataSource are fully initialized
    setTimeout(() => {
      if (this.dataSource && this.sort) {
        this.dataSource.sort = this.sort;
        this.cdr.detectChanges();
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
