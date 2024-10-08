import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RsvpDetails, RsvpDTO} from '../models/rsvpDTO';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RsvpService {

  private rsvpApiUrl = '';

  constructor(private http: HttpClient) {
    this.rsvpApiUrl  = environment.rsvpApiUrl;
    console.log(environment.rsvpApiUrl);
  }

  getAllRsvps(): Observable<RsvpDTO[]> {
    return this.http.get<RsvpDTO[]>(`${this.rsvpApiUrl}/rsvp/allrsvps`);
  }

  saveRsvp(rsvpDetails: RsvpDetails): Observable<RsvpDTO> {
    console.log(`rsvpDetails being sent to be saved to backend - ${JSON.stringify(rsvpDetails, null, 2)}`)
    return this.http.post<RsvpDTO>(`${this.rsvpApiUrl}/rsvp/saversvp`, rsvpDetails);
  }
}
