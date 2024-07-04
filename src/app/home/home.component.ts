import {Component} from '@angular/core';


import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {FlexLayoutModule} from '@angular/flex-layout'; // npm install --save @angular/flex-layout

import {EventsService} from '../services/events.service';

import {Event} from '../models/event';

import { CommonModule, NgFor } from '@angular/common';

import { AttendeesComponent } from '../attendees/attendees.component';

import { RsvpComponent } from '../rsvp/rsvp.component';




@Component({

  selector: 'app-home',

  standalone: true,

  imports: [MatGridListModule, MatCardModule, MatButtonModule, FlexLayoutModule , NgFor, AttendeesComponent, RsvpComponent, CommonModule ],

  templateUrl: './home.component.html',

  styleUrl: './home.component.css'

})



export class HomeComponent {

  //events: Event[] = [];

  showAttendees: boolean  = false;

  showRsvp: boolean  = false;



  events = [

    {

      "id": "1",

      "name": "Nishchaya Tambulam",

      "date": "Aug 15th 2024",

      "location": "5 Loius Ct, Plainsboro, NJ",

      "image": "/assets/pictures/tambulam.jpg",

      "description": "description"

  },

  {

"id": "2",

      "name": "Break Day",

      "date": "Aug 15th 2024",

      "location": "5 Loius Ct, Princeton, NJ",

      "image": "/assets/pictures/funday.jpg",

      "description": "description"

  },

  {

      "id": "3",

      "name": "Engagement & Sangeet",

      "date": "Aug 17th 2024",

      "location": "RasBerry's, 834 NJ-12, French Town, NJ",

      "image": "/assets/pictures/sangeet.jpg",

      "description": "description"

  },

  {

      "id": "4",

      "name": "Haldi & Mehendi",

      "date": "Aug 18th 2024",

      "location": "5 Loius Ct, Princeton, NJ",

      "image": "/assets/pictures/mehendi.png",

      "description": "description"

  },

  {

      "id": "5",

      "name": "Pellikuturu",

      "date": "Aug 19th 2024",

      "location": "5 Loius Ct, Princeton, NJ",

      "image": "/assets/pictures/pellikuthuru.jpg",

      "description": "description"

  },

{

      "id": "6",

      "name": "Break Day",

      "date": "Aug 20th 2024",

      "location": "5 Loius Ct, Princeton, NJ",

      "image": "/assets/pictures/funday.jpg",

      "description": "description"

  },

{

      "id": "7",

      "name": "Kalyanotsavam",

      "date": "Aug 21st 2024",

      "location": "315 Churchill Ave, Somerset, NJ",

      "image": "/assets/pictures/kalyanam.jpg",

      "description": "description"

  },

{

      "id": "8",

      "name": "Satyanarana Swamy Pooja",

      "date": "Aug 22st 2024",

      "location": "605 Charleston Dr, Monroe, NJ",

      "image": "/assets/pictures/satyanarayana-pooja.jpg",

      "description": "description"

  }

  ]

  //constructor(private eventsService: EventsService) {
  constructor() {

    // this.eventsService.getEvents().subscribe(

    //   (response:Event[]) =>{

    //     this.events = response;

    //     console.log(this.events)

    //   },

    //   (error) => {

    //     console.log(error)

    //   }

    // );



  }

  rsvp(event: Event){

    console.log(event.name)

    this.showRsvp = true;

    this.showAttendees = false;

  }



  attendees(event: Event){

    console.log(event.name)

    this.showRsvp = false;

    this.showAttendees = true;

  }

}
