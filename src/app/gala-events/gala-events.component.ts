import { NgFor, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { GalaService } from '../services/gala.service';
import {Event} from '../models/event';
import { GalaEventComponent } from "../gala-event/gala-event.component";

@Component({
  selector: 'app-gala-events',
  standalone: true,
  imports: [MatGridListModule, MatCardModule, MatButtonModule, FlexLayoutModule, NgFor, CommonModule, GalaEventComponent],
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
