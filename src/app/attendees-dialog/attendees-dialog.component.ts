import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit, inject, OnInit, Inject } from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Event } from '../models/event';
import { RsvpDTO } from '../models/rsvpDTO';
import { environment } from '../../environments/environment';
import { RsvpService } from '../services/rsvp.service';

@Component({
  selector: 'app-attendees-dialog',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatTableModule, MatPaginatorModule],
  templateUrl: './attendees-dialog.component.html',
  styleUrls: ['./attendees-dialog.component.css']
})
export class AttendeesDialogComponent implements AfterViewInit{


  selectedEvent: Event;  // Store the passed event data
  private _httpClient = inject(HttpClient);
  rsvpApiUrl: string;

  constructor(
    private rsvpService: RsvpService,
     public dialogRef: MatDialogRef<AttendeesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public incomingData: any              // Inject the passed data here
  ){
    console.log('Event passed to modal:', incomingData.selectedEvent);  // Access the event data
    this.selectedEvent = incomingData.selectedEvent;
    this.rsvpApiUrl  = environment.rsvpApiUrl;
    console.log(environment.rsvpApiUrl);
  }

  // displayedColumns: string[] = ['rsvpId', 'name', 'date', 'location', 'userName', 'adults', 'children'];
  displayedColumns: string[] = ['Event', 'date', 'location', 'userName', 'adults', 'children'];
  data: RsvpDTO[] = [];

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
        startWith([]),  // Initialize with an empty array to avoid type issues
        switchMap(() => {
          return this.rsvpService.getAllRsvps().pipe(
            catchError(() => observableOf([]))  // Handle errors by returning an empty array
          );
        }),
        map(data => {
          this.isLoadingResults = false;

          // Filter the data based on the selected event's name
          const filteredData = data.filter(rsvp => rsvp.rsvpDetails.name === this.selectedEvent.name);
          this.resultsLength = filteredData.length;
          return filteredData;
        })
      )
      .subscribe(filteredData => {
        this.data = filteredData;  // Assign the filtered data to your component's data property
      });
  }

}
