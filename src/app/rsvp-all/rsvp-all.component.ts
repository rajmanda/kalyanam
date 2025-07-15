import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, ViewChild, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { AllRsvpsDialogComponent } from './all-rsvps-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { catchError, of, finalize, Subject, takeUntil, Subscription } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { RsvpService } from '../services/rsvp/rsvp.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { RsvpDetails, RsvpDTO } from '../models/rsvpDTO';

interface SelectableRsvpEvent extends RsvpDetails {
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
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSortModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rsvp-all.component.html',
  styleUrls: ['./rsvp-all.component.css']
})
export class RsvpAllComponent implements OnDestroy {
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private rsvpService: RsvpService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RsvpAllComponent>
  ) {
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

  // ... existing properties and methods ...

  onGetAllRsvps(): void {
    this.rsvpService.getAllRsvps().subscribe({
      next: (allRsvps) => {
        this.dialog.open(AllRsvpsDialogComponent, {
          width: '90vw',
          maxWidth: '1200px',
          data: allRsvps
        });
      },
      error: (error) => {
        this.snackBar.open('Failed to fetch all RSVPs', 'Close', { duration: 3000 });
        console.error('Error fetching all RSVPs:', error);
      }
    });
  }
  displayedColumns: string[] = ['name', 'date', 'adults', 'children'];
  footerColumns: string[] = ['footer'];
  events: SelectableRsvpEvent[] = [];
  isAdmin = false;
  isLoadingResults = false;
  isMobile = false;
  rsvpForm!: FormGroup;

  private destroyed$ = new Subject<void>();

  adultOptions = [0, 1, 2, 3, 4, 5, 6];
  childrenOptions = [0, 1, 2, 3, 4, 5, 6];

  @ViewChild(MatTable) table!: MatTable<any>;


  userProfilex: any;
  loggedin: boolean | false | undefined;
  private subscriptions = new Subscription();



  ngOnInit(): void {
    const profileSubscription = this.authService.userProfile$.subscribe({
      next: (profile) => {
        if (profile && Object.keys(profile).length > 0) {
          this.userProfilex = profile;
          this.loggedin = true;

          const userEmail = this.authService.getUserEmail();
          if (userEmail) {
            this.checkAdminStatus(userEmail);
            this.loadRsvps(userEmail);
          }
        } else {
          this.clearUserData();
        }
      },
      error: (err) => {
        console.error('Error in profile subscription:', err);
        this.clearUserData();
      }
    });

    this.subscriptions.add(profileSubscription);
  }

  private clearUserData(): void {
    this.userProfilex = null;
    this.loggedin = false;
    this.isAdmin = false;
    this.cdr.markForCheck();
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

  private checkAdminStatus(userEmail: string): void {
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

  loadRsvps(userEmail: string): void {
    this.isLoadingResults = true;
    this.rsvpService.getAllRsvps().pipe(
      catchError(() => of([])),
      finalize(() => {
        this.isLoadingResults = false;
        this.safeDetectChanges();
      }),
      takeUntil(this.destroyed$)
    ).subscribe({
      next: (rsvpDtos: RsvpDTO[]) => {
        const userRsvps = rsvpDtos.filter(rsvp => rsvp.rsvpDetails.userEmail === userEmail);
        if (userRsvps.length > 0) {
          this.events = userRsvps.map(rsvp => ({
            ...rsvp.rsvpDetails,
            forGuest: rsvp.rsvpDetails.forGuest || '',
            adults: rsvp.rsvpDetails.adults || 0,
            children: rsvp.rsvpDetails.children || 0,
            comments: rsvp.rsvpDetails.comments || ''
          }));
        } else {
          // Populate with default values if no RSVPs are found
          this.events = [{
            name: 'Default Event',
            date: new Date().toISOString(),
            image: '',
            location: '',
            description: '',
            userName: this.authService.getUserName() || 'Anonymous User',
            userEmail: userEmail,
            rsvp: 'Pending',
            adults: 0,
            children: 0,
            forGuest: '',
            comments: ''
          }];
        }
        this.buildForm();
        this.updateDisplayedColumns();
        this.safeDetectChanges();
      },
      error: (error) => {
        console.error('Error loading RSVPs:', error);
        this.safeDetectChanges();
      }
    });
  }

  private buildForm() {
    const group: { [key: string]: FormControl } = {};
    this.events.forEach((event, i) => {
      group[`event_${i}_adults`] = new FormControl(event.adults);
      group[`event_${i}_children`] = new FormControl(event.children);
      group[`event_${i}_guest`] = new FormControl(event.forGuest);
      group[`event_${i}_comments`] = new FormControl(event.comments);
      group[`event_${i}_name`] = new FormControl(event.name);
      group[`event_${i}_date`] = new FormControl(event.date);
    });
    this.rsvpForm = this.fb.group(group);
  }

  onSubmit(): void {
    const userEmail = this.authService.getUserEmail();
    const userName = this.authService.getUserName();

    const rsvpDetailsArray: RsvpDetails[] = this.events.map((event, i) => ({
      name: event.name,
      date: event.date,
      image: event.image,
      location: event.location,
      description: event.description || '',
      userName: userName || 'Anonymous User',
      userEmail: userEmail || 'unknown@example.com',
      rsvp: 'Confirmed',
      adults: this.rsvpForm.value[`event_${i}_adults`],
      children: this.rsvpForm.value[`event_${i}_children`],
      forGuest: this.rsvpForm.value[`event_${i}_guest`],
      comments: this.rsvpForm.value[`event_${i}_comments`]
    }));

    const eventsToSubmit = rsvpDetailsArray.filter(rsvp =>
      rsvp.adults > 0 || rsvp.children > 0
    );

    let submittedCount = 0;
    eventsToSubmit.forEach(rsvpDetail => {
      this.rsvpService.saveRsvp(rsvpDetail).subscribe({
        next: () => {
          submittedCount++;
          if (submittedCount === eventsToSubmit.length) {
            this.snackBar.open(`Successfully submitted ${submittedCount} RSVPs`, 'Close', { duration: 3000 });
          }
        },
        error: (error) => {
          console.error('Failed to submit RSVP for:', rsvpDetail.name, error);
        }
      });
    });

    this.snackBar.open(`RSVP submitted for ${eventsToSubmit.length} event(s)`, 'Close', { duration: 3000 });

    if (this.dialogRef) {
      this.dialogRef.close(eventsToSubmit);
    }
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
