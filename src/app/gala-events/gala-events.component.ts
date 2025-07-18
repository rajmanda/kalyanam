import { NgFor, CommonModule } from '@angular/common';
import { Component, OnInit  } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { GalaService } from '../services/gala/gala.service';
import {Event} from '../models/event';
import { GalaEventComponent } from "../gala-event/gala-event.component";
import { GalaEventDetails, GalaEventDTO } from '../models/galaEventDTO';

import { of, merge, Observable, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterModule } from '@angular/router';
import { AdminsService } from '../services/admin/admins.service';
import { AuthService } from '../services/auth/auth.service';
import { consumerMarkDirty } from '@angular/core/primitives/signals';
import { RsvpServiceAll } from '../services/rsvp-all.service';

@Component({
  selector: 'app-gala-events',
  standalone: true,
  imports: [MatGridListModule, MatCardModule, MatButtonModule, FlexLayoutModule, NgFor, CommonModule, GalaEventComponent, MatIcon, RouterModule, RouterLink],
  templateUrl: './gala-events.component.html',
  styleUrl: './gala-events.component.css'
})

export class GalaEventsComponent implements OnInit {
  galaEventsDTOs: GalaEventDTO[] = [];
  events: GalaEventDetails[] = [];
  isLoadingResults: boolean = true;
  eventDeletedSubscription: Subscription | undefined;
  isAdmin: boolean = false;

  constructor(private galaService: GalaService, private authService: AuthService, private rsvpServiceAll: RsvpServiceAll) {}

  ngOnInit(): void {

    const userEmail = this.authService.getUserEmail();

    this.authService.isAdmin(userEmail).subscribe(
      (isAdmin) => {
        this.isAdmin = isAdmin;
        console.log("****  IS ADMIN **");
      },
      (error) => {
        console.error('Error checking admin status:', error);
      }
    );

    this.loadGalaEvents();
    // Subscribe to the eventDeleted event
    this.eventDeletedSubscription = this.galaService.eventDeleted.subscribe((deletedEventId) => {
      console.log(`Event with ID ${deletedEventId} was deleted. Reloading events...`);
      this.loadGalaEvents(); // Reload the events
    });
  }

  loadGalaEvents() {
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
      //this.events = this.galaEventsDTOs.map(event => event.galaEventDetails);
      this.events = this.sortEventsByDate(this.events);
      console.log("Sorted Events:", JSON.stringify(this.events, null, 2));
      this.isLoadingResults = false;
    });
  }

private sortEventsByDate(events: GalaEventDetails[]): GalaEventDetails[] {
  return events.sort((a, b) => {
    const dateA = this.parseDate(a.date);
    const dateB = this.parseDate(b.date);
    return dateA.getTime() - dateB.getTime();
  });
}

private parseDate(dateStr: string): Date {
    // Remove the "th", "st", "nd", "rd" from the date string
    const cleanedDateStr = dateStr.replace(/(\d+)(st|nd|rd|th)/, '$1');
    // Parse the cleaned date string
    return new Date(cleanedDateStr);
  }

  onRsvpAllClick(): void {
    this.rsvpServiceAll.openRsvpModal();
  }

}


