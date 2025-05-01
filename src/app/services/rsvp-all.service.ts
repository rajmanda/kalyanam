import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RsvpAllComponent } from '../rsvp-all/rsvp-all.component';

@Injectable({
  providedIn: 'root'
})
export class RsvpServiceAll {
  constructor(private matDialog: MatDialog) {}

  openRsvpModal(): void {
    const dialogRef = this.matDialog.open(RsvpAllComponent, {
      width: '900px',
      maxWidth: '98vw',
      disableClose: false // Prevents closing by clicking outside
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('RSVP was submitted successfully');
        // Add any post-submission logic here
      }
    });
  }
}
