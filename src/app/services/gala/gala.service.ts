import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GalaEventDetails, GalaEventDTO } from '../../models/galaEventDTO';

@Injectable({
  providedIn: 'root',
})
export class GalaService {
  private galaEventsApiUrl = '';
  data: GalaEventDTO[]  = [];

  eventDeleted = new EventEmitter<number>(); // Emit the ID of the deleted event

  constructor(private http: HttpClient) {
    this.galaEventsApiUrl  = environment.galaEventsApiUrl;
    console.log(environment.rsvpApiUrl);
  }

  getGalas(): Observable<GalaEventDTO[]> {
    return this.http.get<GalaEventDTO[]>(`${this.galaEventsApiUrl}/all-gala-events`);
  }
  getAllEvents(): Observable<GalaEventDTO[]> {
    return this.http.get<GalaEventDTO[]>(`${this.galaEventsApiUrl}/all-gala-events`);
  }
  saveGalaEvent(galaEventDetails: GalaEventDetails): Observable<GalaEventDTO> {
    const url = `${this.galaEventsApiUrl}/save-gala-event`; // Adjust the endpoint as needed
    return this.http.post<GalaEventDTO>(url, galaEventDetails);
  }
  // Update an existing GalaEvent
  updateGalaEvent(galaEventId: number, updatedDetails: GalaEventDetails): Observable<GalaEventDTO> {
    const url = `${this.galaEventsApiUrl}/update-gala-event/${galaEventId}`;
    return this.http.put<GalaEventDTO>(url, updatedDetails);
  }

  // Delete a GalaEvent by ID
  deleteGalaEventById(galaEventId: number): Observable<void> {
    const url = `${this.galaEventsApiUrl}/delete-gala-event/${galaEventId}`;
    return this.http.delete<void>(url);
  }

}


