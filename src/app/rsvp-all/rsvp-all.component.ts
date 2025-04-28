import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, ViewChild, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
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
  selected: boolean;
  rsvpStatus: boolean;
  forGuest?: string;
  adults?: number;
  children?: number;
}

@Component({
  selector: 'app-rsvp-all',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rsvp-all.component.html',
  styleUrls: ['./rsvp-all.component.css']
})
export class RsvpAllComponent implements OnDestroy {
  baseColumns = ['select', 'name', 'date', 'rsvp'];
  displayedColumns: string[] = [...this.baseColumns];
  events: SelectableGalaEvent[] = [];
  allSelected = false;
  isAdmin = false;
  isLoadingResults = false;
  isMobile = false;

  private destroyed$ = new Subject<void>();
  private eventDeletedSubscription?: Subscription;

  private readonly authService = inject(AuthService);
  private readonly galaService = inject(GalaService);
  private readonly rsvpService = inject(RsvpService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly breakpointObserver = inject(BreakpointObserver);

  adultOptions = [0, 1, 2, 3, 4, 5, 6];
  childrenOptions = [0, 1, 2, 3, 4, 5, 6];

  @ViewChild(MatTable) table!: MatTable<any>;

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
    this.eventDeletedSubscription?.unsubscribe();
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
          selected: false,
          rsvpStatus: false,
          forGuest: '',
          adults: 0,
          children: 0
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

  toggleAll(): void {
    this.allSelected = !this.allSelected;
    this.events.forEach(event => {
      event.selected = this.allSelected;
      event.rsvpStatus = this.allSelected;
      if (!this.allSelected) {
        event.forGuest = '';
        event.adults = 0;
        event.children = 0;
      }
    });
    this.updateDisplayedColumns();
    this.safeDetectChanges();
  }

  updateAllSelected(): void {
    this.allSelected = this.events.every(event => event.selected);
    if (!this.allSelected) {
      this.events.forEach(event => {
        if (!event.selected) {
          event.rsvpStatus = false;
          event.forGuest = '';
          event.adults = 0;
          event.children = 0;
        }
      });
    }
    this.updateDisplayedColumns();
    this.safeDetectChanges();
  }

  submitRSVP(): void {
    const selectedEvents = this.events.filter(event => event.selected);

    if (selectedEvents.length === 0) {
      this.snackBar.open('No events selected for RSVP', 'Close', { duration: 3000 });
      return;
    }

    console.log('Selected Events Count:', selectedEvents.length);

    selectedEvents.forEach((event, index) => {
      console.log(`Event #${index + 1}:`, {
        name: event.name,
        date: event.date,
        location: event.location,
        rsvpStatus: event.rsvpStatus ? 'Yes' : 'No',
        forGuest: event.forGuest,
        adults: event.adults,
        children: event.children
      });
    });

    this.snackBar.open(`RSVP submitted for ${selectedEvents.length} event(s)`, 'Close', { duration: 3000 });
  }

  updateRsvpStatus(event: SelectableGalaEvent): void {
    if (!event.rsvpStatus) {
      event.forGuest = '';
      event.adults = 0;
      event.children = 0;
    }
    this.updateDisplayedColumns();
    this.safeDetectChanges();
  }

  private updateDisplayedColumns(): void {
    const newColumns = [...this.baseColumns];
    if (this.hasSelectedEvents()) {
      newColumns.push('adults', 'children');
      if (this.isAdmin) {
        newColumns.push('guest');
      }
    }
    this.displayedColumns = newColumns;
  }

  hasSelectedEvents(): boolean {
    return this.events.some(e => e.selected);
  }

  onSelectionChange(event: SelectableGalaEvent): void {
    event.rsvpStatus = event.selected;
    if (!event.selected) {
      event.rsvpStatus = false;
      event.forGuest = '';
      event.adults = 0;
      event.children = 0;
    }
    this.updateAllSelected();
    this.updateDisplayedColumns();
    this.safeDetectChanges();
    if (this.table) {
      this.table.renderRows();
    }
  }

  someSelected(): boolean {
    const numSelected = this.events.filter(event => event.selected).length;
    return numSelected > 0 && numSelected < this.events.length;
  }

  trackByEventId(index: number, event: SelectableGalaEvent): string {
    return event.name;
  }
}
