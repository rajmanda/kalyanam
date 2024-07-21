import {Component, Input, OnInit} from '@angular/core';


import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {FlexLayoutModule} from '@angular/flex-layout'; // npm install --save @angular/flex-layout

import {Event} from '../models/event';

import { CommonModule, NgFor } from '@angular/common';

import { AttendeesComponent } from '../attendees/attendees.component';

import { RsvpComponent } from '../rsvp/rsvp.component';

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
  onRsvpEvent(rsvpEvent: any): void {

    console.log("recieved rsvp event");
    console.log(rsvpEvent);
  }
}
