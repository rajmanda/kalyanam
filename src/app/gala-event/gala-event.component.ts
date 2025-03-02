import { Component, inject, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';


import { RsvpService } from '../services/rsvp.service';
import { RsvpDTO } from '../models/rsvpDTO';
import { CommonModule } from '@angular/common';
import { MatDialog } from "@angular/material/dialog";
import { RsvpDialogComponent } from '../rsvp-dialog/rsvp-dialog.component';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarHorizontalPosition,
  MatSnackBarLabel,
  MatSnackBarRef,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmationSnackbarComponent } from '../confirmation-snackbar/confirmation-snackbar.component';
import { AuthService } from '../services/auth/auth.service';
import { AttendeesDialogComponent } from '../attendees-dialog/attendees-dialog.component';
import { GalaEventDetails } from '../models/galaEventDTO';

@Component({
  selector: 'app-gala-event',
  standalone: true,
  imports: [MatCardModule, CommonModule, RsvpDialogComponent, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction],
  templateUrl: './gala-event.component.html',
  styleUrl: './gala-event.component.css'
})

export class GalaEventComponent {
  @Input() galaEvent: any;
  showAttendees: boolean  = false;
  showRsvp: boolean  = false;
  message: string = "" ;
  selectedEvent: GalaEventDetails | undefined;
  respEvent: any;
  durationInSeconds: number = 5;

  userProfilex: any;
  loggedin: boolean = false;

  constructor(private _rsvpService: RsvpService,
              public _matDialog: MatDialog,
              private _snackBar: MatSnackBar,
              private authService: AuthService){}

  ngOnInit(): void {
    // Subscribe to userProfile$ observable to react immediately to login events
    this.authService.userProfile$.subscribe(profile => {
      if (profile && Object.keys(profile).length > 0) {
        console.log('User Logged In:', profile);
        this.userProfilex = profile;
        this.loggedin = true;
      } else {
        console.log('No user logged in');
        this.userProfilex = null;
        this.loggedin = false;
      }
    });
  }

  openRsvpDialog(event: GalaEventDetails){
    let dialogRef = this._matDialog.open(RsvpDialogComponent, {
      data: { selectedEvent: event }  // Pass event data to the dialog
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}` )
    })
    dialogRef.componentInstance.rsvpEvent.subscribe((rsvpDetails) => {
      this.onRsvpEvent(rsvpDetails);
      console.log(`rsvpDetails: ${JSON.stringify(rsvpDetails, null, 2)}`); // Pretty-printing the object
    });
  }

  openAttendeesDialog(event: GalaEventDetails){
    let dialogRef = this._matDialog.open(AttendeesDialogComponent, {
      data: { selectedEvent: event }  // Pass event data to the dialog
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}` )
    })

  }

  attendees(event: GalaEventDetails){
    this.showAttendees = !this.showAttendees;
    this.selectedEvent = event;
    console.log(event.name)
    this.showRsvp = false;

  }

  onRsvpEvent(rsvpEvent: any): void {
    console.log(`recieved rsvp event - ${rsvpEvent}`);
    console.log("Raj") ;
    rsvpEvent.userName = this.userProfilex.name ;
    rsvpEvent.userEmail =this.userProfilex.email ;

    this._rsvpService.saveRsvp(rsvpEvent).subscribe(
      (response: RsvpDTO) => {
        console.log("RSVP saved:", response);
        this.showRsvp = false ;
        this.message = `thanks! your RSVP Recorded for - ${response.rsvpDetails.name} - for ${response.rsvpDetails.adults}  Adults & + ${response.rsvpDetails.children} kids.`
        this.openSnackBar(this.message);
      },
      (error) => {
        console.error("Error saving RSVP:", error);
      }
    );
  }
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSeconds * 1000,
    });
  }
  // openSnackBar() {
  //   this._snackBar.openFromComponent(ConfirmationSnackbarComponent, {
  //     duration: this.durationInSeconds * 1000,
  //   });
  // }
}
