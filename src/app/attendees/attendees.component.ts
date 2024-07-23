import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-attendees',
  standalone: true,
  imports: [],
  templateUrl: './attendees.component.html',
  styleUrl: './attendees.component.css'
})
export class AttendeesComponent {

  @Input()  event: any;
  @Output() rsvpEvent = new EventEmitter<any>();

  // Other properties and methods

  ngOnInit(): void {
    // Initialize form or any other logic based on the event input
    if (this.event) {
      console.log('Event data:', this.event);
    }
  }
}
