import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import { Event } from '../models/event';
import { AuthService } from '../services/auth/auth.service';
import { AdminsService } from '../services/admin/admins.service';

@Component({
  selector: 'app-rsvp-dialog',
  standalone: true,
  imports: [ MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatDialogModule
    ],
  templateUrl: './rsvp-dialog.component.html',
  styleUrl: './rsvp-dialog.component.css'
})
export class RsvpDialogComponent implements OnInit  {
  rsvpForm: FormGroup;
  adultOptions = [0, 1, 2, 3, 4, 5, 6];
  childrenOptions = [0, 1, 2, 3, 4, 5, 6 ];
  combinedData: undefined;
  isRsvpYes: boolean | true | undefined;
  totalGuests = 0;

  isAdmin: boolean = false; // Flag to check if the user is an admin

  event: Event | undefined
  @Output() rsvpEvent = new EventEmitter<any>();
  userProfilex: any;

  constructor(
    private adminsService: AdminsService,
    private authService: AuthService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RsvpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    console.log('Event passed to modal:', data.selectedEvent);
    this.event = data.selectedEvent;
    this.rsvpForm = this.fb.group({
      rsvp: ['no'],
      adults: [0],
      children: [0],
      forGuest: [''],
      comments: ['']  // Added the comments control
    });

    // Calculate total guests when form values change
    this.rsvpForm.valueChanges.subscribe(value => {
      if (value.rsvp === 'yes') {
        this.totalGuests = (value.adults || 0) + (value.children || 0);
      } else {
        this.totalGuests = 0;
      }
    });
  }

  ngOnInit(): void {
    this.authService.userProfile$.subscribe(profile => {
      if (profile && Object.keys(profile).length > 0) {
        console.log('User Logged In:', profile);
        this.userProfilex = profile;

        // Move the admin check here
        this.adminsService.isAdmin(this.userProfilex.email).subscribe(isAdmin => {
          this.isAdmin = isAdmin;
          if (isAdmin) {
            console.log('The user is an admin.');
          } else {
            console.log('The user is not an admin.');
          }
        });
      } else {
        console.log('No user logged in');
        this.userProfilex = null;
        this.isAdmin = false;
      }
    });

    this.rsvpForm.valueChanges.subscribe(values => {
      console.log(`form changed: ${JSON.stringify(this.rsvpForm.value)}`); // Better logging
      this.updateTotalGuests(values);
    });
  }

  submit(): void {
    if (this.rsvpForm.valid) {
      const formData = this.rsvpForm.value;
      console.log('Form Data:', formData);
      console.log('Event data:', this.event);
      this.combinedData = {
        ...this.rsvpForm.value,
        ...this.event,
        comments: this.rsvpForm.get('comments')?.value // Explicitly include comments
      };
      console.log('Combined Data:', this.combinedData);
      this.rsvpEvent.emit(this.combinedData);
      console.log('After Emitting Event');
      this.dialogRef.close('RSVP submitted');
    } else {
      console.log('Form is invalid');
    }
  }

  updateTotalGuests(values: any): void {
    const adults = +values.adults;
    const children = +values.children;
    this.totalGuests = (adults || 0) + (children || 0);
  }
}
