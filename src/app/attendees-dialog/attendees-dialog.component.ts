import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit, inject, OnInit, Inject } from '@angular/core';
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
import { RsvpService } from '../services/rsvp.service';
import { MatTableDataSource } from '@angular/material/table';

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

  constructor(
    private rsvpService: RsvpService,
    public dialogRef: MatDialogRef<AttendeesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public incomingData: any
  ) {
    console.log('Event passed to modal:', incomingData.selectedEvent);
    this.selectedEvent = incomingData.selectedEvent;
  }

  displayedColumns: string[] = ['event', 'date', 'location', 'userName', 'forGuest', 'adults', 'children'];
  dataSource: MatTableDataSource<RsvpDTO> = new MatTableDataSource();

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

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
          return filteredData;
        })
      )
      .subscribe(filteredData => {
        this.dataSource = new MatTableDataSource(filteredData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }
}
