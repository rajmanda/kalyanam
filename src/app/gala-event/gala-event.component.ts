import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {Event} from '../models/event';

import { AttendeesComponent } from '../attendees/attendees.component';

import { RsvpComponent } from '../rsvp/rsvp.component';
import { RsvpService } from '../services/rsvp.service';
import { RsvpDTO } from '../models/rsvpDTO';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gala-event',
  standalone: true,
  imports: [MatCardModule, RsvpComponent, CommonModule],
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

  constructor(private _rsvpService: RsvpService){}
  ngOnInit(): void {
    if (this.galaEvent) {
      console.log('Event data:', this.galaEvent);
    }
  }
  rsvp(event: Event){
    this.showRsvp = !this.showRsvp;
    this.selectedEvent = event;
    console.log(this.selectedEvent.name)
    this.showAttendees = false;
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
