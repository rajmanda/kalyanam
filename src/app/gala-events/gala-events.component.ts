import { NgFor, CommonModule } from '@angular/common';
import { Component, OnInit  } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { GalaService } from '../services/gala.service';
import {Event} from '../models/event';
import { GalaEventComponent } from "../gala-event/gala-event.component";
import { GalaEventDetails, GalaEventDTO } from '../models/galaEventDTO';

import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-gala-events',
  standalone: true,
  imports: [MatGridListModule, MatCardModule, MatButtonModule, FlexLayoutModule, NgFor, CommonModule, GalaEventComponent],
  templateUrl: './gala-events.component.html',
  styleUrl: './gala-events.component.css'
})

export class GalaEventsComponent implements OnInit {
  galaEventsDTOs: GalaEventDTO[] = [];
  events: GalaEventDetails[] = [];
  isLoadingResults: boolean = true;

  constructor(private galaService: GalaService) {}

  ngOnInit(): void {
    this.galaService.getAllEvents()
      .pipe(
        startWith([]),
        switchMap(() => {
          return this.galaService.getAllEvents().pipe(
            catchError(() => of([]))
          );
        })
      )
      .subscribe(eventsDtos => {
        this.galaEventsDTOs = eventsDtos;
        this.events = this.galaEventsDTOs.map(event => event.galaEventDetails);
        this.events = this.sortEventsByDate(this.events);
        console.log("Sorted Events:", JSON.stringify(this.events, null, 2));
        this.isLoadingResults = false;
      });
  }

  private sortEventsByDate(events: GalaEventDetails[]): GalaEventDetails[] {
    return events.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
  }
}


