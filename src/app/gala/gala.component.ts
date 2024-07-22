import {Component, Input, OnInit} from '@angular/core';


import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {FlexLayoutModule} from '@angular/flex-layout'; // npm install --save @angular/flex-layout

import {Event} from '../models/event';

import { CommonModule, NgFor } from '@angular/common';

import { AttendeesComponent } from '../attendees/attendees.component';

import { RsvpComponent } from '../rsvp/rsvp.component';
import { RsvpService } from '../services/rsvp.service';
import { RsvpDTO } from '../models/rsvpDTO';

@Component({
  selector: 'app-gala',
  standalone: true,
  imports: [MatGridListModule, MatCardModule, MatButtonModule, FlexLayoutModule , NgFor, AttendeesComponent, RsvpComponent, CommonModule ],
  templateUrl: './gala.component.html',
  styleUrl: './gala.component.css'
})
export class GalaComponent implements OnInit {

  @Input() event: any;
  showAttendees: boolean  = false;
  showRsvp: boolean  = false;
  message: string = "" ;

  constructor(private _rsvpService: RsvpService){}
  ngOnInit(): void {
    if (this.event) {
      console.log('Event data:', this.event);
    }
  }

  selectedEvent: Event | undefined;
  rsvp(event: Event){
    this.showRsvp = !this.showRsvp;

    this.selectedEvent = event;
    console.log(this.selectedEvent.name)
    this.showAttendees = false;
  }


  attendees(event: Event){
    this.showAttendees = !this.showAttendees;
    console.log(event.name)
    this.showRsvp = false;

  }
  respEvent: any;
  // onRsvpEvent(rsvpEvent: any): void {

  //   console.log("recieved rsvp event");
  //   console.log(rsvpEvent);
  // }

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
