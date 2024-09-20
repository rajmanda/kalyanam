import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {Event} from '../models/event';

import { AttendeesComponent } from '../attendees/attendees.component';

import { RsvpComponent } from '../rsvp/rsvp.component';
import { RsvpService } from '../services/rsvp.service';
import { RsvpDTO } from '../models/rsvpDTO';
import { CommonModule } from '@angular/common';
import { MatDialog } from "@angular/material/dialog";
import { RsvpDialogComponent } from '../rsvp-dialog/rsvp-dialog.component';

@Component({
  selector: 'app-gala-event',
  standalone: true,
  imports: [MatCardModule, RsvpComponent, CommonModule, RsvpDialogComponent],
  templateUrl: './gala-event.component.html',
  styleUrl: './gala-event.component.css'
})

export class GalaEventComponent {
  @Input() galaEvent: any;
  showAttendees: boolean  = false;
  showRsvp: boolean  = false;
  message: string = "" ;
  selectedEvent: Event | undefined;
  respEvent: any;

  constructor(private _rsvpService: RsvpService, public _matDialog: MatDialog){}

  ngOnInit(): void {
    if (this.galaEvent) {
      console.log('Event data:', this.galaEvent);
    }
  }
  openRsvpDialog(event: Event){
    // this.showRsvp = !this.showRsvp;
    // this.selectedEvent = event;
    // console.log(this.selectedEvent.name)
    // this.showAttendees = false;
    // let dialogRef = this._matDialog.open(RsvpDialogComponent);
    let dialogRef = this._matDialog.open(RsvpDialogComponent, {
      data: { selectedEvent: event }  // Pass event data to the dialog
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}` )
    })
    dialogRef.componentInstance.rsvpEvent.subscribe((rsvpDetails) => {
      this.onRsvpEvent(rsvpDetails);
    });
  }


  attendees(event: Event){
    this.showAttendees = !this.showAttendees;
    this.selectedEvent = event;
    console.log(event.name)
    this.showRsvp = false;

  }

  onRsvpEvent(rsvpEvent: any): void {
    console.log("recieved rsvp event");
    console.log(rsvpEvent);
    console.log("Raj") ;

    this._rsvpService.saveRsvp(rsvpEvent).subscribe(
      (response: RsvpDTO) => {
        console.log("RSVP saved:", response);
        this.showRsvp = false ;
        this.message = "thanks RSVP Recorded"
      },
      (error) => {
        console.error("Error saving RSVP:", error);
      }
    );
  }
}
