import { NgFor, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { AttendeesComponent } from '../attendees/attendees.component';
import { RsvpComponent } from '../rsvp/rsvp.component';
import { GalaService } from '../services/gala.service';
import {Event} from '../models/event';

@Component({
  selector: 'app-gala-events',
  standalone: true,
  imports: [ MatGridListModule, MatCardModule, MatButtonModule, FlexLayoutModule , NgFor, AttendeesComponent, RsvpComponent, CommonModule ],
  templateUrl: './gala-events.component.html',
  styleUrl: './gala-events.component.css'
})
export class GalaEventsComponent {

  galaEvents: Event[] = []; // Initialize an empty array of type Events

  constructor(private _galaService: GalaService){
  }
  ngOnInit(): void {
    this.galaEvents = this._galaService.getGalas()
  }

}
