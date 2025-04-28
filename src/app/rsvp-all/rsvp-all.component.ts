import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, ViewChild, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { catchError, of, Subscription, finalize, Subject, takeUntil } from 'rxjs';
import { GalaEventDetails, GalaEventDTO } from '../models/galaEventDTO';
import { GalaService } from '../services/gala/gala.service';
import { AuthService } from '../services/auth/auth.service';
import { RsvpService } from '../services/rsvp/rsvp.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

interface SelectableGalaEvent extends GalaEventDetails {
  forGuest: string;
  adults: number;
  children: number;
  comments: string;
}

@Component({
  selector: 'app-rsvp-all',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rsvp-all.component.html',
  styleUrls: ['./rsvp-all.component.css']
})
export class RsvpAllComponent implements OnDestroy {
  displayedColumns: string[] = ['name', 'date', 'adults', 'children'];
  events: SelectableGalaEvent[] = [];
  isAdmin = false;
  isLoadingResults = false;
  isMobile = false;

  private destroyed$ = new Subject<void>();

  adultOptions = [0, 1, 2, 3, 4, 5, 6];
  childrenOptions = [0, 1, 2, 3, 4, 5, 6];

  @ViewChild(MatTable) table!: MatTable<any>;

  private readonly authService = inject(AuthService);
  private readonly galaService = inject(GalaService);
  private readonly rsvpService = inject(RsvpService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly breakpointObserver = inject(BreakpointObserver);

  constructor() {
    this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.Tablet
    ]).pipe(
      takeUntil(this.destroyed$)
    ).subscribe(result => {
      this.isMobile = result.matches;
      this.safeDetectChanges();
    });
  }

  ngOnInit(): void {
    this.checkAdminStatus();
    this.loadGalaEvents();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private safeDetectChanges() {
    if (!this.destroyed$.closed) {
      setTimeout(() => this.cdr.markForCheck());
    }
  }

  private checkAdminStatus(): void {
    const userEmail = this.authService.getUserEmail();
    this.authService.isAdmin(userEmail).pipe(
      takeUntil(this.destroyed$)
    ).subscribe({
      next: (isAdmin) => {
        this.isAdmin = isAdmin;
        this.updateDisplayedColumns();
        this.safeDetectChanges();
      },
      error: (error) => console.error('Error checking admin status:', error)
    });
  }

  loadGalaEvents(): void {
    this.isLoadingResults = true;
    this.galaService.getAllEvents().pipe(
      catchError(() => of([])),
      finalize(() => {
        this.isLoadingResults = false;
        this.safeDetectChanges();
      }),
      takeUntil(this.destroyed$)
    ).subscribe({
      next: (eventsDtos: GalaEventDTO[]) => {
        this.events = eventsDtos.map(event => ({
          ...event.galaEventDetails,
          forGuest: '',
          adults: 0,
          children: 0,
          comments: ''
        })).sort((a, b) => this.sortEventsByDate(a, b));
        this.updateDisplayedColumns();
        this.safeDetectChanges();
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.safeDetectChanges();
      }
    });
  }

  private sortEventsByDate(a: GalaEventDetails, b: GalaEventDetails): number {
    return this.parseDate(a.date).getTime() - this.parseDate(b.date).getTime();
  }

  private parseDate(dateStr: string): Date {
    const cleanedDateStr = dateStr.replace(/(\d+)(st|nd|rd|th)/, '$1');
    return new Date(cleanedDateStr);
  }

  submitRSVP(): void {
    console.log('Submitting RSVP for events:', this.events);

    // Filter out events with no attendees
    const eventsWithAttendees = this.events.filter(
      event => event.adults! > 0 || event.children! > 0
    );

    if (eventsWithAttendees.length === 0) {
      this.snackBar.open('Please select at least one attendee for at least one event', 'Close', { duration: 3000 });
      return;
    }

    this.snackBar.open(`RSVP submitted for ${eventsWithAttendees.length} event(s)`, 'Close', { duration: 3000 });

    // Here you would typically call your RSVP service to save the data
    // this.rsvpService.submitRSVP(eventsWithAttendees).subscribe(...);
  }

  private updateDisplayedColumns(): void {
    const columns = ['name', 'date', 'adults', 'children'];
    if (this.isAdmin) {
      columns.push('guest');
    }
    columns.push('comments');
    this.displayedColumns = columns;
  }
}
