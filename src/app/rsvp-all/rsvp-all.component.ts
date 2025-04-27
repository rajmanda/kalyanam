import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
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
import { catchError, of, Subscription } from 'rxjs';

import { GalaEventDetails, GalaEventDTO } from '../models/galaEventDTO';
import { GalaService } from '../services/gala/gala.service';
import { AuthService } from '../services/auth/auth.service';
import { RsvpService } from '../services/rsvp/rsvp.service';

interface SelectableGalaEvent extends GalaEventDetails {
  selected: boolean;
  rsvpStatus: boolean;
  comments: string;
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
export class RsvpAllComponent {
  baseColumns = ['select', 'image', 'name', 'date', 'location', 'rsvp'];
  displayedColumns: string[] = [...this.baseColumns];
  events: SelectableGalaEvent[] = [];
  allSelected = false;
  isAdmin = false;
  isLoadingResults = false;
  private eventDeletedSubscription?: Subscription;

  private readonly authService = inject(AuthService);
  private readonly galaService = inject(GalaService);
  private readonly rsvpService = inject(RsvpService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  adultOptions = [0, 1, 2, 3, 4, 5, 6];
  childrenOptions = [0, 1, 2, 3, 4, 5, 6];

  @ViewChild(MatTable) table!: MatTable<any>;

  ngOnInit(): void {
    this.checkAdminStatus();
    this.loadGalaEvents();
  }

  ngOnDestroy(): void {
    this.eventDeletedSubscription?.unsubscribe();
  }

  private checkAdminStatus(): void {
    const userEmail = this.authService.getUserEmail();
    this.authService.isAdmin(userEmail).subscribe({
      next: (isAdmin) => {
        this.isAdmin = isAdmin;
        this.updateDisplayedColumns();
        this.cdr.markForCheck();
      },
      error: (error) => console.error('Error checking admin status:', error)
    });
  }

  loadGalaEvents(): void {
    this.isLoadingResults = true;
    this.galaService.getAllEvents()
      .pipe(catchError(() => of([])))
      .subscribe({
        next: (eventsDtos: GalaEventDTO[]) => {
          this.events = eventsDtos.map(event => ({
            ...event.galaEventDetails,
            selected: false,
            rsvpStatus: false,
            comments: '',
            forGuest: '',
            adults: 0,
            children: 0
          })).sort((a, b) => this.sortEventsByDate(a, b));
          this.isLoadingResults = false;
          this.updateDisplayedColumns();
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading events:', error);
          this.isLoadingResults = false;
          this.cdr.markForCheck();
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
        event.comments = '';
        event.forGuest = '';
        event.adults = 0;
        event.children = 0;
      }
    });
    this.updateDisplayedColumns();
    this.cdr.detectChanges();
  }

  updateAllSelected(): void {
    this.allSelected = this.events.every(event => event.selected);
    if (!this.allSelected) {
      this.events.forEach(event => {
        if (!event.selected) {
          event.rsvpStatus = false;
          event.comments = '';
          event.forGuest = '';
          event.adults = 0;
          event.children = 0;
        }
      });
    }
    this.updateDisplayedColumns();
    this.cdr.detectChanges();
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
        comments: event.comments,
        forGuest: event.forGuest,
        adults: event.adults,
        children: event.children
      });
    });

    this.snackBar.open(`RSVP submitted for ${selectedEvents.length} event(s)`, 'Close', { duration: 3000 });
  }

  updateRsvpStatus(event: SelectableGalaEvent): void {
    if (!event.rsvpStatus) {
      event.comments = '';
      event.forGuest = '';
      event.adults = 0;
      event.children = 0;
    }
    this.updateDisplayedColumns();
    this.cdr.detectChanges();
  }

  private updateDisplayedColumns(): void {
    const newColumns = [...this.baseColumns];
    if (this.hasSelectedEvents()) {
      newColumns.push('comments', 'adults', 'children');
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
      event.comments = '';
      event.forGuest = '';
      event.adults = 0;
      event.children = 0;
    }
    this.updateAllSelected();
    this.updateDisplayedColumns();
    this.cdr.detectChanges();
    if (this.table) {
      this.table.renderRows();
    }
  }

  someSelected(): boolean {
    const numSelected = this.events.filter(event => event.selected).length;
    return numSelected > 0 && numSelected < this.events.length;
  }

  trackByEventId(index: number, event: SelectableGalaEvent): string {
    return event.name; // Use ID if available, otherwise fall back to name
  }
}
