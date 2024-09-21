import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RsvpDTO} from '../models/rsvpDTO';


@Injectable({
  providedIn: 'root'
})
export class RsvpService {

  private baseUrl = 'http://localhost:8080/rsvp';

  constructor(private http: HttpClient) { }

  saveRsvp(rsvpEvent: RsvpDTO): Observable<RsvpDTO> {
    console.log(`RsvpDTO being sent to be saved to backend - ${JSON.stringify(rsvpEvent, null, 2)}`)
    return this.http.post<RsvpDTO>(`${this.baseUrl}/saversvp`, rsvpEvent);
  }
}
