import {Component, OnInit} from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {FlexLayoutModule} from '@angular/flex-layout'; // npm install --save @angular/flex-layout
import {Event} from '../models/event';
import { CommonModule, NgFor } from '@angular/common';
import { AttendeesComponent } from '../attendees/attendees.component';
import { RsvpComponent } from '../rsvp/rsvp.component';
import { GalaComponent } from "../gala/gala.component";
import { GalaService } from '../services/gala.service';
import { RsvpDTO } from '../models/rsvpDTO';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatGridListModule, MatCardModule, MatButtonModule, FlexLayoutModule, NgFor, AttendeesComponent, RsvpComponent, CommonModule, GalaComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [GalaService]
})


export class HomeComponent implements OnInit{



  respEvent: any;
  showAttendees: boolean  = false;
  showRsvp: boolean  = false;
  selectedEvent: Event | undefined;
  events: Event[] = []; // Initialize an empty array of type Events

  constructor(private _galaService: GalaService){
  }
  ngOnInit(): void {
    this.events = this._galaService.getGalas()
  }



  rsvp(event: Event){
    this.selectedEvent = event;
    console.log(this.selectedEvent.name)

    this.showRsvp = true;
    this.showAttendees = false;

  }

  attendees(event: Event){

    console.log(event.name)
    this.showRsvp = false;
    this.showAttendees = true;
  }

}
