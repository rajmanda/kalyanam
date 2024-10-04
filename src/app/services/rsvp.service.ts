import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RsvpDTO} from '../models/rsvpDTO';
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

  saveRsvp(rsvpEvent: RsvpDTO): Observable<RsvpDTO> {
    console.log(`RsvpDTO being sent to be saved to backend - ${JSON.stringify(rsvpEvent, null, 2)}`)
    return this.http.post<RsvpDTO>(`${this.rsvpApiUrl}/saversvp`, rsvpEvent);
  }
}
