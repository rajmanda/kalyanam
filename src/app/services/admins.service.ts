import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdminsDTO } from '../models/admins';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminsService {

    private adminsApiUrl = '';
    data: AdminsDTO[]  = [];

    constructor(private http: HttpClient, private oauthService: OAuthService) {
      this.adminsApiUrl  = environment.adminsApiUrl;
      console.log(environment.adminsApiUrl);
    }

    getAdmins(): Observable<AdminsDTO[]> {
      return this.http.get<AdminsDTO[]>(`${this.adminsApiUrl}/alladmins`);
    }

    isAdmin(email: string): Observable<boolean> {
      return this.getAdmins().pipe(
        map(admins => {
          // Check if any admin has the matching email
          const isAdmin = admins.some(admin => {
            return admin.email === email;
          });
          return isAdmin; // Return true or false
        })
      );
    }
}
