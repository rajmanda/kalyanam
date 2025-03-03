import {Component, OnInit} from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {FlexLayoutModule} from '@angular/flex-layout'; // npm install --save @angular/flex-layout
import {Event} from '../models/event';
import { CommonModule, NgFor } from '@angular/common';
import { GalaService } from '../services/gala.service';
import { RsvpDTO } from '../models/rsvpDTO';
import { GalaEventsComponent } from "../gala-events/gala-events.component";
import { GalaEventDetails, GalaEventDTO } from '../models/galaEventDTO';

import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatGridListModule, MatCardModule, MatButtonModule, FlexLayoutModule, CommonModule, GalaEventsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [GalaService]
})

export class HomeComponent {

}
