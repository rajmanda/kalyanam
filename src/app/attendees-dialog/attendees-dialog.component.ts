import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit, inject, Inject } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Event } from '../models/event';
import { RsvpDTO } from '../models/rsvpDTO';
import { environment } from '../../environments/environment';
import { RsvpService } from '../services/rsvp/rsvp.service';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-attendees-dialog',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatTableModule, MatPaginatorModule],
  templateUrl: './attendees-dialog.component.html',
  styleUrls: ['./attendees-dialog.component.css']
})
export class AttendeesDialogComponent implements AfterViewInit {
  selectedEvent: Event;
  private _httpClient = inject(HttpClient);

  // Totals
  totalAdults: number = 0;
  totalChildren: number = 0;
  grandTotal: number = 0;
  currentUserEmail: string | null = null;

  displayedColumns: string[] = ['userName', 'forGuest', 'adults', 'children', 'comments'];
  dataSource: MatTableDataSource<RsvpDTO> = new MatTableDataSource();

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    private rsvpService: RsvpService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<AttendeesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public incomingData: any
  ) {
    console.log('Event passed to modal:', incomingData.selectedEvent);
    this.selectedEvent = incomingData.selectedEvent;
    this.currentUserEmail = this.authService.getUserEmail();
  }

  ngAfterViewInit() {
    this.isLoadingResults = true;

    this.rsvpService.getAllRsvps()
      .pipe(
        startWith([]),
        switchMap(() => {
          return this.rsvpService.getAllRsvps().pipe(
            catchError(() => observableOf([]))
          );
        }),
        map(data => {
          this.isLoadingResults = false;
          const filteredData = data.filter(rsvp => rsvp.rsvpDetails.name === this.selectedEvent.name);
          this.resultsLength = filteredData.length;
          return this.sortDataForCurrentUser(filteredData);
        })
      )
      .subscribe(sortedData => {
        this.dataSource = new MatTableDataSource(sortedData);
        this.dataSource.paginator = this.paginator;
        this.paginator.pageSize = 8;
        this.dataSource.sort = this.sort;

        setTimeout(() => {
          if (this.sort) {
            this.sort.active = 'userName';
            this.sort.direction = 'asc';
          }
        });

        this.calculateTotals();
      });
  }

  private sortDataForCurrentUser(data: RsvpDTO[]): RsvpDTO[] {
    if (!this.currentUserEmail) return data;

    return data.sort((a, b) => {
      const aIsCurrentUser = a.rsvpDetails.userEmail === this.currentUserEmail;
      const bIsCurrentUser = b.rsvpDetails.userEmail === this.currentUserEmail;

      if (aIsCurrentUser && !bIsCurrentUser) return -1;
      if (!aIsCurrentUser && bIsCurrentUser) return 1;

      return a.rsvpDetails.userEmail.localeCompare(b.rsvpDetails.userEmail);
    });
  }

  calculateTotals(): void {
    this.totalAdults = this.dataSource.data.reduce((sum, element) => sum + element.rsvpDetails.adults, 0);
    this.totalChildren = this.dataSource.data.reduce((sum, element) => sum + element.rsvpDetails.children, 0);
    this.grandTotal = this.totalAdults + this.totalChildren;
  }

  printAll() {
    const originalPageSize = this.paginator.pageSize;

    this.paginator.pageSize = this.resultsLength;
    this.dataSource.paginator = this.paginator;

    setTimeout(() => {
      window.print();
      this.paginator.pageSize = originalPageSize;
      this.dataSource.paginator = this.paginator;
    }, 500);
  }
}
