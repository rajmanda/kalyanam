import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RsvpDTO } from '../models/rsvpDTO';


@Injectable({
  providedIn: 'root'
})
export class RsvpService {

  private baseUrl = 'http://localhost:8080/rsvp';

  constructor(private http: HttpClient) { }

  saveRsvp(rsvpEvent: RsvpDTO): Observable<RsvpDTO> {
    return this.http.post<RsvpDTO>(`${this.baseUrl}/saversvp`, rsvpEvent);
  }
}
